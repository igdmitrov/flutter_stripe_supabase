import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class PaymentPage extends StatefulWidget {
  const PaymentPage({super.key});

  @override
  State<PaymentPage> createState() => _PaymentPageState();
}

class _PaymentPageState extends State<PaymentPage> {
  CardFieldInputDetails? _cardData;
  int _amount = 10;
  bool isLoading = false;

  Future<void> _pay(String orderId) async {
    setState(() {
      isLoading = true;
    });

    try {
      final response = await _createPaymentIntent(orderId, _amount);

      final paymentStatus = await Stripe.instance.confirmPayment(
        response.data,
        const PaymentMethodParams.card(
          paymentMethodData: PaymentMethodData(),
        ),
      );

      if (paymentStatus.status == PaymentIntentsStatus.Succeeded) {
        print('Succeeded');
      } else if (paymentStatus.status == PaymentIntentsStatus.Canceled) {
        print('Payment cancelled');
      }
    } catch (error) {
      if (!mounted) return;
      print(error);
    }

    setState(() {
      isLoading = false;
    });
  }

  Future<FunctionResponse> _createPaymentIntent(
      String orderId, int amount) async {
    final response = await Supabase.instance.client.functions
        .invoke('create_payment_intent', body: {
      'orderId': orderId,
      'amount': amount,
    });

    return response;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: Column(
            children: [
              Text(
                _amount.toStringAsFixed(2),
                style: const TextStyle(fontSize: 18),
              ),
              CardField(
                onCardChanged: (card) {
                  _cardData = card;
                },
              ),
              ElevatedButton(
                onPressed: isLoading
                    ? null
                    : () => _pay(
                        '19edf12e-3e9d-4a38-b41d-a8cc5661b263'), //your order id
                child: Text(isLoading ? 'Loading' : 'Pay'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

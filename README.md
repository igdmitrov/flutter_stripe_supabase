## Flutter + Supabase + Stripe

### Video on YouTube:
[![My video](https://img.youtube.com/vi/tu4FN4BEWGw/0.jpg)](https://youtu.be/tu4FN4BEWGw)

### Supabase Edge Functions

Create a new function:
```
supabase functions new your_function_name
```

Supabase initialization:
```
supabase init
```

Link to Supabase project
```
supabase link --project-ref project_id
```

Supabase secrets:
```
supabase secrets list
```

Add a new secret:
```
supabase secrets set NAME=VALUE
```

Deploy function:
```
supabase functions deploy your_function_name
```

Deploy public funtion:
```
supabase functions deploy your_function_name --no-verify-jwt
```

Delete function:
```
supabase functions delete your_function_name
```

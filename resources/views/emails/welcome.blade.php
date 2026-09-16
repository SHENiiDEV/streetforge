<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to StreetForge</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 8px; padding: 32px; border: 1px solid #334155;">
        <h1 style="color: #06b6d4; margin-top: 0;">STREETFORGE</h1>
        <h2>Welcome to the Grid, {{ $user->name }}!</h2>
        <p>Your driver account has been created successfully. We've credited your garage with your first sports car and 1,000 Starter Credits to tune your machine.</p>
        
        <div style="background-color: #0f172a; border-radius: 6px; padding: 16px; margin: 20px 0; border: 1px solid #334155;">
            <p style="margin: 4px 0;"><strong>Registered Driver:</strong> {{ $user->full_name }}</p>
            <p style="margin: 4px 0;"><strong>Email:</strong> {{ $user->email }}</p>
            <p style="margin: 4px 0;"><strong>Country:</strong> {{ $user->country }}</p>
        </div>

        <p>Head over to the Garage to install upgrades and start competing on global circuits.</p>
        
        <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;">
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            {{ $company['name'] }} &bull; Reg: {{ $company['number'] }}<br>
            {{ $company['address'] }}<br>
            Support: {{ $company['email'] }}
        </p>
    </div>
</body>
</html>

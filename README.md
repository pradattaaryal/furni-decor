APP_ENV=development
APP_EMAIL=webexpertsnepal20@gmail.com
HTTP_ENABLE=true
HTTP_HOST=0.0.0.0
HTTP_PORT=3001
#psql -h localhost -p 5439 -U postgres -d furni_decor

# //TRUNCATE TABLE categories CASCADE;



    # const key = this.configService
    #   .get<string>('auth.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY')
    #   ?.trim();


# SELECT pg_terminate_backend(pid)
# FROM pg_stat_activity
# WHERE datname = 'furni_decor';
# DROP DATABASE IF EXISTS furni_decor;
#pm_1SMhHiFhrbYI1auhUwuO2Hym
DATABASE_TYPE=postgres
DATABASE_URL=
DATABASE_HOST=localhost
DATABASE_PORT=5439
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=root
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=false
DATABASE_REJECT_UNAUTHORIZED=false
DATABASE_SSL_ENABLED=false
DATABASE_MAX_CONNECTIONS=20
DATABASE_NAME=furni_decorr
DATABASE_CA=
DATABASE_KEY=
DATABASE_CERT=

FRONTEND_CANCLE_URL=http://localhost:3000/cancle
FRONTEND_SUCESS_URL=http://localhost:3000/sucess

#Image
IMG_MAX_FILE_SIZE=5mb
IMG_MAX_FILE=1

# logger/debugger
DEBUGGER_HTTP_WRITE_INTO_FILE=false
DEBUGGER_HTTP_WRITE_INTO_CONSOLE=false
DEBUGGER_SYSTEM_WRITE_INTO_FILE=true
DEBUGGER_SYSTEM_WRITE_INTO_CONSOLE=false

# limit for single api to hit (eg: 5 otp request in 60 seconds)
MAX_REQUEST_HIT=5
MAX_REQUEST_HIT_EXPIRATION_TIME_IN_MILLI_SECONDS=120

#Worker Pool
WORKER_IDLE_TIMEOUT_MILLISECONDS=10000
WORKER_MAX_THREADS=4
WORKER_MIN_THREADS=1

PASSWORD_MAX_REQUEST_LIMIT=10

EMAIL_VERIFICATION_TOKEN_SECRET_KEY=sadgasgdjasgdjsagjsagjsagjasgjasgdj
EMAIL_VERIFICATION_TOKEN_EXPIRED_IN_SECONDS=120

#Redis
REDIS_HOST=localhost
REDIS_PASSWORD=
REDIS_PORT=6379 

#JWT
AUTH_JWT_ACCESS_TOKEN_SECRET_KEY=shdkajshdkahdkashkdhaskdhksahdkashdkashdksahkjsahsahdjk
#AUTH_JWT_REFRESH_TOKEN_SECRET_KEY=shdkajshdkahdkashkdhaskdhksahdkashdkashdksahkjsahsahdjk
AUTH_JWT_ACCESS_TOKEN_EXPIRED=7d

FRONT_END_FORGOT_PASSWORD_LINK=http://localhost:3000/auth/reset-password/
FRONT_END_BASE_URL=http://localhost:3000

MAX_FILE_COUNT=20

#STRIPE
STRIPE_SECRET_KEY=sk_test_51PBbwFFhrbYI1auhiaETjFUJubDXricEdJkWZ2tXJfTWKlGn2C1WaUhQBvGcNigYQVVTMz9VCcL9ul8B2g6UizRF00KbD9kTAu
STRIPE_WEB_HOOK_SECRET_KEY=we_1SI0rKFhrbYI1auhbdCslHrb
STRIPE_PUBLISHABLE_KEY=pk_test_51PBbwFFhrbYI1auhDSTfqxWg5BXCwkadhGzozOn0O3KMpeCLSjXxEW7Wz3p8UcyjqSlF4t2z1YRsCc8ZFv2uYDLU00uXCF1PZI
STRIPE_WEB_HOOK_SIGNITURE=whsec_74HR1P2pKTaupBHPTADlnlrzgU6XwYAO
API_VERSION= 2025-08-27.basil,
#stripesec=we_1SGX85FhrbYI1auhbPVaphsA,name,slug,image,quantity,price

GOOGLE_CLIENT_ID=329354452732-6e04ckpaagb7htdbmoeuq2s3fm1gqbvi.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=http://localhost:3001/backend/api/admin/auth/google/callback

PAYPAL_CLIENT_ID=AUruK_O0tmWfrhCIdLuID-Tu_li5U0LPOiPx8Vcpei_p-pmybogwNG5uItgHA3R3YkCJAI6IaOtd9kch
PAYPAL_CLIENT_SECRET=EHR9poJ2AzVnCxXhHVDNxunGOzd8Re6F0mnvNIET5ykGdkPBk75OABs_4VN_HMQIae773pdpv6PQslvt
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
PAYPAL_MODE=sandbox
PAYPAL_RETURN_URL=https://decor.wendevs.com/
PAYPAL_CANCEL_URL=https://decor.wendevs.com/notfound
 
 
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=pradattaaryal2468@gmail.com
MAIL_PASS=ynlp fuye kxoc zxmw
MAIL_FROM=pradattaaryal2468@gmail.com
MAIL_SERVICE=gmail
AUTH_JWT_ACCESS_TOKEN_SECRET_KEY=cdhbjbscjhbdskcKLNcJKSDCNKDSJCNSDKJcnskdjchbdjbhds

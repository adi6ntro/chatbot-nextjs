# Setup Installation Frontend

yarn install # atau npm install
cp .env.local.example .env.local # Edit API_CHATBOT_KEY/API_CHATBOT_BACKEND

# Dev

yarn dev

# Build & Run prod

yarn build
yarn start

# Docker

docker build -t chatbot-nextjs .
docker run -p 3001:3001 chatbot-nextjs

# Setup Installation Backend (sample)

cd backend
npm install

npm start

docker build -t chatbot-backend .
docker run -p 5001:5001 chatbot-backend

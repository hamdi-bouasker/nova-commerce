
# NovaCommerce   
https://novacommerce.rf.gd 

I have used Antigravity IDE assisted with integrated Antigravity AI Agent powered by Gemini pro. 


NovaCommerce is a modern e-commerce application built with a React frontend and a native PHP backend. It features a premium, responsive design, user authentication, product management (admin), and a shopping cart system.

![NovaCommerce Preview](https://github.com/hamdi-bouasker/nova-commerce/blob/main/nova-commerce.png)

## 🚀 Key Features

*   **Modern UI/UX**: Built with custom CSS and Tailwind for a sleek, cleaner look.
*   **User Authentication**: Sign up, login, and profile management.
*   **Product Management**: Admin dashboard to add, edit, and delete products.
*   **Shopping Cart**: Persistent cart state and checkout flow.
*   **Categories & Filtering**: Filter products by category or sort by price.
*   **AI Integration**: Integrated Chatbot for customer support (Google GenAI).
*   **Antigravity IDE**: 70% of the project was developed using Antigravity IDE and Antigravity AI by Google following prompt engineering using my own long IT experience to submit accurate prompts. I have to tweak few frontend design features and fix some backend functionalities errors. 

## 🛠️ Tech Stack

### Frontend
*   **React 19**: Library for building user interfaces.
*   **TypeScript**: Static typing for safer code.
*   **Vite**: Next Generation Frontend Tooling.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **Lucide React**: Beautiful & consistent icons.
*   **State Management**: React Context API (`StoreContext`, `AuthContext`).
*   **Gemini chatbot**


### Backend
*   **PHP (Native)**: RESTful API implementation.
*   **MySQL**: Relational database for data persistence.
*   **PDO**: Secure database abstraction layer.
*   **Apache/Nginx**: Compatible with standard PHP hosting (e.g., InfinityFree).

### Deployment 

* Deployment was done manually 
* **Free Hosting**: Project files and DB configured and hosted for free on *infinityfree.com*

## 📂 Project Structure

```bash
nova-commerce/
├── backend/            # PHP API endpoints (config/db.php, api/, etc.)
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # Global state (Auth, Store)
│   ├── services/       # API integration helpers
│   ├── types.ts        # TypeScript definitions
│   ├── App.tsx         # Main application logic
│   └── main.tsx        # Entry point
├── .env                # Environment variables
└── package.json        # Frontend dependencies
```

## ⚙️ Setup & Installation

### 1. Backend Setup
1.  **Database**: Create a MySQL database and import the `backend/seed_products.sql` file (if available) or set up the tables manually.
2.  **Configuration**:
    *   Create a `.env` file in the project root:
        ```ini
        DB_HOST=your_db_host
        DB_NAME=your_db_name
        DB_USER=your_db_user
        DB_PASS=your_db_password
        ```
    *   Ensure your web server (Apache/Nginx) points to the project root and allows PHP execution for the `backend/` folder.

### 2. Frontend Setup
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Configure Environment**:
    *   Update `.env` with your API URL:
        ```ini
        VITE_API_URL=http://localhost/nova-commerce/backend/api
        VITE_API_KEY=your_google_genai_key
        ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Build for Production**:
    ```bash
    npm run build
    ```

## 🛡️ Security

*   **Environment Variables**: Credentials are stored in `.env` and not hardcoded (`db.php` updated).
*   **Input Validation**: Basic sanitization on both frontend and backend.
*   **CORS**: Configured to allow requests from the frontend domain.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

# PolicyGen AI

PolicyGen AI is a web project that generates policies using AI integration. It is built using **Deno/JavaScript** with a simple, responsive frontend and a placeholder favicon. The project is fully deployed and accessible online.

---

## **Live Demo**

Check out the live project here:  
[https://policygen-ai.vercel.app/](https://policygen-ai.vercel.app/)

---

## **Features**

- AI-powered policy generation (via integrated API).  
- Fully responsive design for desktop and mobile.  
- Placeholder favicon displayed in the browser tab.  
- Quick deployment on Vercel (free).  

---

## **Project Structure**

/project-root
│
├─ main.ts # Deno server entry point
├─ index.html # Frontend HTML
├─ assets/
│ └─ favicon.png # Placeholder favicon
├─ README.md
└─ ...

yaml
Copy code

---

## **Setup & Run Locally**

1. **Install Deno** (if using server features):  
   [https://deno.com/manual/getting_started](https://deno.com/manual/getting_started)

2. **Clone the repository**:  
   ```bash
   git clone <your-repo-url>
   cd <your-project-folder>
Set environment variable (if needed for API):

bash
Copy code
export LOVABLE_API_KEY="your_api_key_here"
Run the project locally:

bash
Copy code
deno run --allow-net --allow-env main.ts
Open http://localhost:8000 to view it locally.

Favicon
The browser tab shows a placeholder favicon:

html
Copy code
<link rel="icon" type="image/png" href="https://via.placeholder.com/32" />
You can replace this with a custom logo later.

Deployment
The project is deployed on Vercel (Free Tier):

GitHub repository connected → automatic deployments.

Live URL: https://policygen-ai.vercel.app/

License
This project is open-source and free to use.

yaml
Copy code

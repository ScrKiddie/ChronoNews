# ChronoNews

<p align="center">
<img src="https://github.com/user-attachments/assets/c7b12e41-e63d-49d7-b783-55f27d7388fb" alt="chrononews">
</p>

ChronoNews is a modern news platform with a Hybrid SPA & SSR architecture, delivering both top-tier performance and a seamless user experience. This platform allows users to create image-supported news content, powered by the [ChronoNewsAPI](https://github.com/ScrKiddie/ChronoNewsAPI) backend.

## Key Features

- **Hybrid Rendering**: Public article pages are server-rendered for fast initial loads and SEO. Upon loading, React hydrates the page to enable interactivity, transitioning the experience into a Single Page Application (SPA).
- **Image-Enhanced Post Creation**: Users can create and manage news articles with images.
- **Minimalist & Responsive Design**: Clean and simple design ensures a comfortable user experience across devices.
- **Integrated Backend**: Connected to [ChronoNewsAPI](https://github.com/ScrKiddie/ChronoNewsAPI) for dynamic news management.

## Technologies

- **React JS**: Powers the dynamic user interface on both client and server.
- **Vite**: Provides a fast development experience and optimized builds.
- **Tailwind CSS**: Utility-first CSS framework for rapid responsive design.
- **Node.js**: Runs the server for the initial SSR.

## Environment Variables

| **Key**                     | **Type** | **Description**                                                                         | **Example**                |
| --------------------------- | -------- | --------------------------------------------------------------------------------------- | -------------------------- |
| **NODE_ENV**                | `string` | Defines the application environment (`development` or `production`).                    | `production`               |
| **PORT**                    | `number` | The port on which the server will run.                                                  | `5137`                     |
| **VITE_TURNSTILE_SITE_KEY** | `string` | Turnstile (reCAPTCHA) site key                                                          | `0x4AAABABA_vmrAXsPDzuG1l` |
| **VITE_CHRONONEWSAPI_URI**  | `string` | URL of the backend API from [ChronoNewsAPI](https://github.com/ScrKiddie/ChronoNewsAPI) | `http://localhost:6969`    |
| **VITE_DISQUS_SHORTNAME**   | `string` | Disqus shortname for your site                                                          | `your-shortname`           |

## Setup & Run

### Prerequisites

- Node.js (v18 or higher recommended)
- A running instance of the [ChronoNewsAPI](https://github.com/ScrKiddie/ChronoNewsAPI)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/scrkiddie/chrononews.git
    cd chrononews
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure environment variables**
    Create a `.env` file in the root of the project and add the necessary variables from the table above.

### Running the Application

- **Development Mode**
  Starts the server with Vite's middleware for hot-reloading.

    ```bash
    npm run dev
    ```

- **Production Mode**
  First, build the assets for both client and server, then start the production server.
    ```bash
    npm run build
    npm run serve
    ```

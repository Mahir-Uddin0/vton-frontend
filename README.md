# AI Virtual Try-On Frontend

Fit Check is a polished, responsive web experience for AI-powered virtual clothing try-on. A user provides a photo of themselves, a garment image, and a short garment description; the application securely forwards those inputs to a FastAPI try-on service and presents the generated image alongside the original inputs.

This repository contains the frontend application. It focuses on making an image-generation workflow approachable: clear upload states, optional camera capture, progress feedback during generation, actionable error messages, and an easy way to start another try-on.

## Highlights

- **Guided virtual try-on flow** — validates the required person image, garment image, and garment description before generation.
- **Flexible image input** — supports drag and drop, file selection, and camera capture for both input images.
- **Backend integration without browser CORS friction** — a Next.js route handler proxies multipart requests to the FastAPI service from the server.
- **Resilient result rendering** — supports generated images returned as image bytes, URLs, data URLs, or base64 values in common JSON response shapes.
- **Responsive, accessible interface** — keyboard-focus styles, descriptive image alt text, live loading feedback, and layouts that adapt from mobile to desktop.
- **Deliberate user experience** — source images and the generated result are shown together so users can visually compare the outcome.

## How it works

```text
Browser
  │  person image + garment image + garment description
  ▼
Next.js POST /api/tryon
  │  multipart/form-data (server-side proxy)
  ▼
FastAPI virtual try-on service
  │  generated image
  ▼
Results dashboard
```

1. The user uploads or captures a full-body photo and a garment image, then supplies a garment description/type.
2. The browser sends the input as `multipart/form-data` to the same-origin `/api/tryon` route.
3. The route validates the request and forwards it to the configured FastAPI `/tryon` endpoint.
4. The frontend displays the generated try-on image with the original person and garment images.

## Tech stack

| Area | Technologies |
| --- | --- |
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| UI and motion | Base UI, shadcn/ui, Lucide icons, Framer Motion |
| Backend integration | Next.js Route Handler → FastAPI multipart endpoint |

## Run locally

### Prerequisites

- Node.js 20.9 or later
- npm
- Access to a compatible FastAPI virtual try-on API

### Installation

```bash
git clone <your-repository-url>
cd vton-frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other useful commands:

```bash
npm run lint
npm run build
npm run start
```

## Backend contract

The frontend proxies requests from `POST /api/tryon` to the FastAPI endpoint configured in [`app/api/tryon/route.ts`](app/api/tryon/route.ts). The proxy preserves the uploaded files and uses this multipart request contract:

| Field | Type | Description |
| --- | --- | --- |
| `person_image` | image file | Full-body photo of the person. |
| `garment_image` | image file | Image of the garment to try on. |
| `description` | string | Garment description or type, such as `Full Sleeve Shirt`. |

The FastAPI service may return image bytes directly or JSON containing the generated image. JSON responses can provide an HTTP(S) URL, a `data:image/...` URL, or base64 image content. The client recognizes common keys including `image_url`, `generated_image`, `result_image`, `tryon_image`, `image`, `output`, and `result`.

### Connect a different backend

Update `TRY_ON_ENDPOINT` in [`app/api/tryon/route.ts`](app/api/tryon/route.ts) to the deployed URL of a compatible FastAPI `POST /tryon` endpoint. Keeping this URL in the server-side route means the browser only communicates with the Next.js application; the upstream service does not need to enable browser CORS for this frontend.

## Project structure

```text
app/
├── api/tryon/route.ts       # Server-side proxy and request validation
├── layout.tsx               # Global metadata and application shell
└── page.tsx                 # Try-on state and screen transitions
components/
├── LandingPage.jsx          # Product introduction and entry experience
├── UploadStudio.jsx         # Upload, camera capture, validation, and loading UI
└── ResultsDashboard.jsx     # Input/result comparison view
lib/
└── api.ts                   # Browser-side API client and response normalization
```

## Design and engineering notes

- The proxy performs basic server-side validation before contacting the backend and returns clear upstream failures to the UI.
- Images are previewed in the browser using object URLs, so a user can verify selections before submitting.
- The app uses a 60-second route duration to accommodate the longer processing time typical of image-generation workloads.
- The frontend intentionally keeps inference, model hosting, and image persistence in the backend layer, allowing the UI to remain deployable as a standard Next.js application.

## Future enhancements

- Add image size/type limits and user-facing guidance based on backend model requirements.
- Add authentication, request history, and consent/privacy controls when supporting persistent user accounts.
- Add automated component, integration, and end-to-end test coverage.

## License

This project is currently intended as a portfolio project. Add a license file before distributing or reusing it publicly.

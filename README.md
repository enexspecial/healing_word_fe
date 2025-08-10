# Healing Word Church Website

A modern, responsive website for Healing Word Church built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern, responsive design
- ⚡ Fast performance with Next.js
- 📱 Mobile-first approach
- 🎯 SEO optimized
- ♿ Accessibility focused
- 🎨 Beautiful UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Homepage
│   │   ├── globals.css     # Global styles
│   │   ├── about/          # About page
│   │   ├── events/         # Events page
│   │   ├── ministries/     # Ministries page
│   │   ├── contact/        # Contact page
│   │   └── donate/         # Donate page
│   ├── components/         # Reusable components
│   │   ├── ui/            # UI components
│   │   ├── layout/        # Layout components
│   │   └── sections/      # Page sections
│   ├── lib/               # Utility libraries
│   ├── styles/            # Additional styles
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── public/                # Static assets
│   ├── images/           # Images
│   └── icons/            # Icons
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **PostCSS** - CSS processing

## Customization

### Colors
The color scheme can be customized in `tailwind.config.js`:
- Primary: Blue shades
- Secondary: Yellow/Gold shades  
- Accent: Purple/Pink shades

### Content
Update the content in the page components to match your church's information:
- Service times
- Contact information
- Church address
- Ministry details

## Deployment

This project can be deployed to:
- Vercel (recommended)
- Netlify
- Any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

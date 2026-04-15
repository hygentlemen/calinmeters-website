# Calin Meters Website

Professional website for Calin Meters - smart prepaid meters manufacturer.

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm start
```

## Deploy to Vercel

### Option 1: Vercel Dashboard (Recommended)

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: `./`
6. Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

## Domain Configuration

1. Deploy to Vercel first
2. In Vercel dashboard, go to your project
3. Go to "Settings" → "Domains"
4. Add `www.calinmeters.com`
5. Follow Vercel's instructions to update DNS records

## Content Structure

### Main Sections

- **Home**: Hero section with product overview
- **Products**: Smart electricity, water, and gas meters
- **About Us**: Company information and experience
- **News**: Industry insights and updates
- **Contact**: Contact form and information

### Adding Product Images

1. Copy product images from `/Volumes/My Passport/表计/产品图片及使用说明/`
2. Place them in `/public/images/products/`
3. Update the product cards in `app/page.tsx`

### Adding Company Logo

1. Copy logo from `/Volumes/My Passport/表计/宣传资料/Logo.jpg`
2. Place in `/public/logo.png`
3. Update navigation in `app/page.tsx`

## SEO Optimization

The website is already optimized for search engines with:

- Semantic HTML structure
- Proper meta tags
- Responsive design
- Fast page loads

To further improve SEO:

1. Add unique title and description to each page
2. Create a sitemap.xml
3. Add schema.org markup
4. Create individual product pages

## Folder Structure

```
calinmeters-website/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   ├── images/
│   └── logo.png
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Customization

### Colors

Edit `tailwind.config.ts` to change the color scheme.

### Content

Edit `app/page.tsx` to update text, products, and sections.

### Adding New Pages

Create new directories in `app/` with `page.tsx` files.

## License

Copyright © 2025 Calin Meters. All rights reserved.

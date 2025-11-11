# Bridal Party Wedding Website

A beautiful, mobile-first wedding/bridal party website optimized for iPad and iPhone devices. Built with elegant design inspired by modern wedding aesthetics.

## Features

- **Mobile-First Design** - Optimized for iPad and iPhone
- **Elegant Typography** - Serif and script fonts for a sophisticated look
- **Soft Color Palette** - Neutral tones (taupe, champagne, sage, dusty rose, ivory)
- **Smooth Navigation** - Side menu with smooth scrolling
- **Interactive Checklist** - To-do list with localStorage persistence
- **Responsive Layout** - Adapts to all screen sizes
- **iOS Optimizations** - Special meta tags and touch handling for iOS devices
- **Password Protected** - Secure authentication for private access
- **Modular SCSS** - Organized, maintainable styling system

## Sections

1. **Welcome** - Hero image with welcome message
2. **The Crew** - Bridal party member profiles with photos
3. **Important Events** - Timeline of key dates
4. **The Venue** - Location details with photos and contact info
5. **Itinerary** - Day-by-day schedule breakdown
6. **The Dress** - Dress code with color palette and style examples
7. **The Vibe** - Photo gallery showing the wedding theme
8. **Our Stay** - Accommodation information
9. **To Do List** - Interactive checklist for bridesmaids
10. **Thank You** - Closing message

---

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- OpenWeather API key (get one at https://openweathermap.org/api)

### Setup

1. **Create your `.env` file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and set your credentials:**
   ```bash
   AUTH_PASSWORD=YourActualPasswordHere
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```

3. **Build and run:**
   ```bash
   docker-compose up -d
   ```

4. **Access the site:**
   - Visit: http://localhost:8080
   - Login with the password you set in `.env`

### Stop the Container

```bash
docker-compose down
```

### How It Works

- The `Dockerfile` builds SCSS to CSS automatically
- The `docker-entrypoint.sh` script generates `config.json` from environment variables at runtime
- Your `.env` file is gitignored for security
- The password is never stored in the Docker image
- Container fails to start if AUTH_PASSWORD is not set

### Security Notes

- **Never commit `.env`** - It contains your actual password and API key
- **Never hardcode secrets in Dockerfile or docker-compose.yml**
- Use strong passwords in production
- The container will fail to start if AUTH_PASSWORD is not set

### Updating Configuration

1. Edit `.env` file
2. Restart the container:
   ```bash
   docker-compose restart wedding-website
   ```

### Troubleshooting

**Container fails to start with "AUTH_PASSWORD not set" error:**
- Make sure you created a `.env` file in the project root
- Make sure `AUTH_PASSWORD=YourPassword` is set in `.env`
- Check that docker-compose.yml has `- AUTH_PASSWORD=${AUTH_PASSWORD}`

**Password not working:**
- Check `.env` file has the correct password
- Restart the container after changing `.env`
- Clear browser localStorage and try again

---

## Local Development (Without Docker)

### Prerequisites
- Node.js and npm installed

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create local config:**
   ```bash
   cp config.example.json config.json
   ```

3. **Edit `config.json` with your password:**
   ```json
   {
     "auth": {
       "password": "YourPasswordHere"
     }
   }
   ```

4. **Build SCSS:**
   ```bash
   npm run scss:build
   ```

5. **Serve the site:**
   Use any static file server, for example:
   ```bash
   npx http-server public -p 8080
   ```

6. **Access:**
   Visit http://localhost:8080

### Configuration Methods

The app checks for configuration in this order:

1. **Environment Variables (via `window.__APP_CONFIG__`)** - Injected by server (for Docker)
2. **config.json** - Local configuration file (for development)
3. **Hardcoded Defaults** - Fallback if no config is found

---

## SCSS Development

### Directory Structure

```
public/scss/
├── main.scss              # Main entry point (imports all modules)
├── auth.scss              # Auth page styles
├── base/
│   ├── _variables.scss    # CSS custom properties
│   ├── _reset.scss        # CSS reset & base styles
│   ├── _layout.scss       # Layout structure & section backgrounds
│   ├── _typography.scss   # Typography styles
│   └── _responsive.scss   # Media queries (MUST BE LAST)
├── components/
│   ├── _nav.scss          # Navigation menu
│   ├── _dividers.scss     # Section dividers
│   ├── _modals.scss       # Crew member modals
│   ├── _image-modal.scss  # Image lightbox modal
│   └── _property-modal.scss # Property details & house rules modals
└── sections/
    ├── _hero.scss         # Welcome section
    ├── _crew.scss         # The Crew section
    ├── _events.scss       # Important Dates section
    ├── _venue.scss        # The Venue section
    ├── _itinerary.scss    # Itinerary/Timeline section
    ├── _dress.scss        # The Dress section
    ├── _vibe.scss         # The Vibe section (hidden)
    ├── _stay.scss         # Our Stay section
    ├── _beauty.scss       # The Rest section (accessories)
    ├── _pack.scss         # Pack Your Bags section
    ├── _weather.scss      # Weather forecast
    └── _thankyou.scss     # Thank you section
```

### NPM Scripts

```bash
# Build SCSS once (development)
npm run scss:build          # Builds both main.scss and auth.scss

# Build individual files
npm run scss:build:main     # Build just main.scss
npm run scss:build:auth     # Build just auth.scss

# Watch for changes and auto-compile
npm run scss:watch          # Watches main.scss only

# Build for production (minified)
npm run scss:prod           # Builds both minified
npm run scss:prod:main      # Build just main minified
npm run scss:prod:auth      # Build just auth minified
```

### Development Workflow

#### Making Style Changes

1. **Find the right SCSS file** - Styles are organized by component/section
2. **Edit the SCSS file** - Make your changes in `/public/scss/`
3. **Compile** - Run `npm run scss:build` or use watch mode
4. **Test** - Refresh the browser to see changes

#### Watch Mode (Recommended)

For active development, use watch mode to auto-compile on save:

```bash
npm run scss:watch
```

This will monitor SCSS files and automatically recompile when you save changes.

### Important Notes

- **Never edit `/public/css/styles.css` or `/public/css/auth.css` directly** - They're auto-generated
- All changes should be made in `/public/scss/` files
- The `_responsive.scss` file **MUST** be imported last to ensure media queries override base styles
- Use `@use` instead of `@import` (modern SCSS syntax)

### Troubleshooting

**Styles not applying?**
- Make sure you compiled: `npm run scss:build`
- Check browser cache - hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Verify CSS files were updated (check file timestamp)

**SCSS won't compile?**
- Make sure dependencies are installed: `npm install`
- Check for syntax errors in SCSS files
- Make sure you're in the project root directory

---

## Customization

### Update Content

The site is fully componentized. Edit HTML files in `public/components/`:

- **Header** - `public/components/header.html` (navigation)
- **Welcome** - `public/components/welcome.html`
- **The Crew** - `public/components/crew.html`
- **Important Dates** - `public/components/important.html`
- **Venue** - `public/components/venue.html`
- **Itinerary** - `public/components/itinerary.html`
- **Dress** - `public/components/dress.html`
- **Our Stay** - `public/components/stay.html`
- **Modals** - `public/components/modals/*.html`

### Update Styling

Edit SCSS files in `public/scss/` (organized by component/section):
- **Color palette** - `public/scss/base/_variables.scss`
- **Layout & backgrounds** - `public/scss/base/_layout.scss`
- **Typography** - `public/scss/base/_typography.scss`
- **Responsive breakpoints** - `public/scss/base/_responsive.scss`
- **Individual sections** - `public/scss/sections/`
- **Components** - `public/scss/components/`

After editing, compile with `npm run scss:build`

### Add Images

Images are organized in `public/images/` by category:

```
public/images/
├── accessories/    # Shoes, jewelry, hair, nails
├── crew/          # Bridesmaids photos
├── dresses/       # Dress options
├── icons/         # Favicons and logos
├── social/        # Social media icons
├── stay/          # Property/accommodation photos
├── venue/         # Venue photos
└── vibe/          # Theme/aesthetic photos
```

Replace placeholder images with your own, keeping the same filenames.

### iOS App Icon

Add these files for iOS home screen icons:
- `public/images/icons/apple-touch-icon.png` (180x180)
- `public/images/icons/favicon.png` (32x32)

---

## Technology Stack

- **HTML5** - Semantic markup with componentized structure
- **CSS3/SCSS** - Modular styling with Sass preprocessing
- **ES6 Modules** - Modern JavaScript with no frameworks
- **Nginx** - High-performance web server
- **Docker** - Containerized deployment
- **Node.js** - For SCSS compilation

### JavaScript Architecture

The site uses ES6 modules for clean, maintainable code:

```
public/js/
├── main.js                    # Main entry point
├── auth.js                    # Auth page entry point
└── modules/
    ├── componentLoader.js     # HTML component loader
    ├── config.js              # Configuration loader
    ├── auth.js                # Authentication logic
    ├── navigation.js          # Navigation & smooth scroll
    ├── scrollLock.js          # Scroll locking utility
    ├── dressCarousel.js       # Dress carousel
    ├── accessoryCarousels.js  # Accessory carousels
    ├── stayCarousel.js        # Property carousel
    ├── imageModal.js          # Image modal/lightbox
    ├── propertyModals.js      # Property detail modals
    └── weather.js             # Weather forecast
```

---

## iOS/iPad Optimizations

This website includes several iOS-specific optimizations:

- **Viewport Settings** - Prevents unwanted zooming
- **Safe Area Support** - Respects iPhone notches and home indicators
- **Touch Optimizations** - Prevents double-tap zoom
- **Web App Capable** - Can be added to home screen as a standalone app
- **Font Smoothing** - Optimized text rendering on retina displays
- **Tap Highlighting** - Removed default tap highlights for cleaner UI

---

## Browser Support

- iOS Safari 12+
- iPadOS Safari 13+
- Chrome (mobile & desktop)
- Firefox (mobile & desktop)
- Edge

---

## Project Structure

```
.
├── backend/                # Weather API backend
├── public/                 # Frontend files
│   ├── components/        # HTML components
│   ├── css/              # Compiled CSS (auto-generated)
│   ├── images/           # Images organized by category
│   ├── js/               # JavaScript modules
│   ├── scss/             # SCSS source files
│   ├── auth.html         # Login page
│   ├── index.html        # Redirect to auth
│   └── main.html         # Main app
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── config.example.json   # Local config template
├── docker-compose.yml    # Docker Compose configuration
├── docker-entrypoint.sh  # Docker entrypoint script
├── Dockerfile            # Docker image definition
├── nginx.conf            # Nginx configuration
├── package.json          # Node.js dependencies and scripts
└── README.md             # This file
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Mscrnt LLC

---

## Credits

Design inspired by elegant wedding templates and modern bridal aesthetics.

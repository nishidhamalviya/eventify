# 🎟️ Eventify – Responsive Event Management Website

Eventify is a modern, fully responsive event management website built with **HTML5, CSS3 and vanilla JavaScript**. Users can explore upcoming events, search and filter them, view detailed information and register through a validated form. Registrations are stored in the browser using **Local Storage**.

> Built for the **K Explore – Web Designing** task: *Design and Develop a Responsive Event Management Website*.

---

## ✨ Features

### Core requirements
| Requirement | Implementation |
|---|---|
| Hero section | Animated gradient hero with headline, CTAs, animated stats and a "Next up" event card |
| Upcoming & featured events | Dedicated **Featured** section plus a full **Browse All Events** grid |
| Event cards | Image, title, category, date/time, venue, price, seats left and short description |
| Search | Live, debounced search across title, venue, city, category and description |
| Category filter | Dynamic filter chips generated from the event data |
| Event details | Modal with full description, schedule timeline, venue, price and seat availability |
| Registration form | Name, email, phone, selected event, ticket count and terms checkbox |
| JS validation | Real-time + on-submit validation with clear inline error messages |
| Confirmation message | Animated success screen with a booking ID and ticket summary |
| Responsive design | Mobile-first layouts tested for phones, tablets and desktops |

### 🎁 Bonus features
- 🌗 **Dark / Light mode** – remembers your choice and respects system preference
- ⏳ **Live countdown timers** – on the hero card and inside event details
- 🎬 **Animations** – scroll-reveal, card entrance, hover effects, animated counters, success checkmark
- 💾 **Local Storage registration management** – view and cancel bookings under *My Registrations*
- 🪑 **Seat tracking** – available seats update automatically as people register
- 🚫 **Duplicate protection** – the same email can't register twice for the same event

### Other UX touches
Sticky blurred header with scroll-spy, mobile hamburger menu, sort options, empty state, toast messages, back-to-top button, keyboard support (`Esc` closes modals), skip link, `aria-*` attributes and `prefers-reduced-motion` support.

---

## ✅ Form Validation Rules

| Field | Rule |
|---|---|
| Event | Must be selected and not already finished |
| Name | Required, min 3 characters, letters/spaces only |
| Email | Required, valid format (`name@domain.tld`) |
| Phone | Required, valid 10-digit Indian mobile number (starts with 6–9; `+91` prefix accepted) |
| Tickets | Integer between 1 and 5, and not more than remaining seats |
| Terms | Must be accepted |

---

## 🗂️ Project Structure

```
eventify/
├── index.html        # Page structure & semantic markup
├── css/
│   └── style.css     # Design tokens, layout, components, responsive rules
├── js/
│   ├── events.js     # Event data (easy to edit / extend)
│   └── app.js        # Rendering, filtering, validation, storage, UI logic
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

- **HTML5** – semantic structure and accessibility attributes
- **CSS3** – custom properties (theming), Grid, Flexbox, animations, media queries
- **JavaScript (ES6+)** – no frameworks or build step required
- **Local Storage** – persistence for registrations and theme
- **Google Fonts** – Outfit & Inter
- Placeholder event images from [picsum.photos](https://picsum.photos) (a gradient + emoji fallback is shown if images fail to load)

---

## 🚀 Run Locally

No installation needed.

```bash
git clone https://github.com/<your-username>/eventify.git
cd eventify
# Option 1: just open index.html in your browser
# Option 2: use a local server
npx serve .
# or
python3 -m http.server 8000
```

---

## 🌐 Deployment

### GitHub Pages
1. Push the project to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under *Build and deployment*, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

### Netlify
Drag-and-drop the project folder at [app.netlify.com/drop](https://app.netlify.com/drop), or connect the GitHub repo (no build command, publish directory `.`).

### Vercel
Import the repo at [vercel.com/new](https://vercel.com/new) – choose *Other* framework preset, leave build settings empty and deploy.

---

## 🧠 Implementation Notes

- **Data-driven UI:** All events live in `js/events.js`. Cards, filters, the details modal and the registration dropdown are generated from this single source, so adding an event is just adding an object.
- **Theming:** Colours are defined as CSS variables; `[data-theme="dark"]` overrides them. An inline script in `<head>` applies the saved theme before first paint to avoid a flash.
- **Security:** All dynamic text is passed through an `escapeHTML` helper before being inserted into the DOM.
- **State:** A small `state` object tracks category, search query and sort order; every change re-renders the grid.
- **Storage:** Registrations are saved as JSON under the `eventify-registrations` key; seats remaining are computed from stored bookings.
- **Resilience:** Storage access is wrapped in `try/catch`, and cover images gracefully fall back to a gradient + emoji.

### Adding a new event
```js
{
  id: 9,
  title: "My New Event",
  category: "Tech",
  date: "2027-03-01T10:00:00",
  venue: "Some Venue", city: "Some City",
  price: 0, seats: 100, featured: false,
  emoji: "🎉",
  gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  image: "https://picsum.photos/seed/mynewevent/800/520",
  short: "One-line summary.",
  description: "Longer description.",
  schedule: ["10:00 AM – Start", "05:00 PM – End"]
}
```

> **Note:** Events dated in the past are automatically marked as ended and cannot be registered for. If you open the project much later, update the dates in `js/events.js`.

---

## 📸 Screenshots
*Add screenshots of the homepage, event details, registration form (light & dark) and mobile view here.*

---

## 🔮 Future Improvements
- Backend + database for real bookings and payments
- User authentication and organiser dashboard
- Calendar (.ics) export and email confirmations
- Map integration for venues

---

## 👤 Author
**Your Name** – [GitHub](https://github.com/<your-username>) · [LinkedIn](https://linkedin.com/in/<your-handle>)

## 📄 License
Released under the [MIT License](https://opensource.org/licenses/MIT).

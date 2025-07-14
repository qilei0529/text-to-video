# 🎬 Text-to-Video Generator

A modern web application built with Next.js that transforms text prompts into engaging videos with customizable animations, audio, and visual settings.

## ✨ Features

- **Text-to-Video Generation**: Convert text prompts into dynamic videos
- **Customizable Animation Settings**: Control video animations and transitions
- **Audio Integration**: Add and customize audio settings for your videos
- **Flexible Dimensions**: Adjust video dimensions and aspect ratios
- **Real-time Preview**: Preview your video before final generation
- **Modern UI**: Clean, responsive interface built with Tailwind CSS and shadcn/ui
- **TypeScript Support**: Fully typed for better development experience

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended package manager)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/text-to-video.git
   cd text-to-video
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Usage

1. **Enter your text prompt** in the text input field
2. **Customize video settings**:
   - Animation settings (transitions, effects)
   - Audio settings (background music, voice)
   - Dimensions (resolution, aspect ratio)
   - Visual appearance (colors, themes)
3. **Preview your video** in real-time
4. **Generate and download** your final video

## 🏗️ Project Structure

```
text-to-video/
├── app/                    # Next.js App Router pages
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components (shadcn/ui)
│   │   └── video/         # Video-specific components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions
├── public/                # Static assets
└── ...config files
```

## 🎯 Core Components

- **VideoGeneration**: Main video generation interface
- **VideoSettingsPanel**: Comprehensive settings management
- **VideoPreview**: Real-time video preview
- **VideoAnimationSettings**: Animation and transition controls
- **VideoAudioSettings**: Audio customization options
- **VideoDimensionsSettings**: Size and aspect ratio controls

## 🔧 Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript compiler check
```

### Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **Package Manager**: pnpm

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
4. **Commit your changes**

   ```bash
   git commit -m 'Add some amazing feature'
   ```

5. **Push to the branch**

   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use existing UI components from `src/components/ui`
- Write meaningful commit messages
- Update documentation for new features
- Test your changes thoroughly

## 🐛 Issues

Found a bug or have a feature request? Please open an issue on [GitHub Issues](https://github.com/your-username/text-to-video/issues).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- All contributors who help make this project better

## 📞 Support

- 📧 Email: <qilei0529@gmail.com>
- 🐦 X: [@qilei](https://x.com/qilei)

---


<div align="center">
    <h1>ChatGPT</h1>
    <p><b>ChatGPT clone with an API key that has no destination other than OpenAI's servers</b></p>
    <p>Statically hosted on <a href="https://chat.kerthical.com">https://chat.kerthical.com</a></p>
</div>

<p align="center">
    <img alt="Static Badge" src="https://img.shields.io/badge/LICENSE-WTFPL-orange?style=for-the-badge">
</p>

# ChatGPT

### Features

- [x] GPT-3.5, GPT-4
- [x] Minimal dependencies
- [x] Responsive design
- [x] Light/Dark mode
- [x] Localization (English, Japanese)
- [x] Robust project structure
- [x] Content retrieval from Text files, PDF
- [x] Image understanding
- [x] Custom instruction
- [x] Chat history (Stored in browser)

### Self-hosting guide

The following command will generate static files in the `./dist` directory. You can open it on your local host or any
hosting service. My demo is hosted on cloudflare.

```
git clone https://github.com/kerthical/chatgpt
cd chatgpt
pnpm i
pnpm build
```

### Project structure

The project is divided into directories under `src` to separate interests, and is designed for easy refactoring even if
frameworks or libraries are changed.

- **Bundler**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://reactjs.org/)
- **UI Framework**: [Mantine](https://mantine.dev/)
- **State management**: [Jotai](https://jotai.org/)

```
.
├── src                 # All "source" code is here
│   ├── app             # Framework specific code (Vite, React)
│   │   ├── pages       # Renderable pages
│   │   ├── components  # Reusable components
│   │   ├── hooks       # Custom hooks
│   │   ├── stores      # Global stores (using jotai)
│   │   ├── entry.tsx   # Entrypoint (Render function)
│   │   └── router.tsx  # Virtualized router
│   ├── assets          # Static assets (favicons, robots.txt, etc.)
│   ├── locales         # Localization files and translator utils
│   ├── types           # Global types
│   ├── index.html      # EntryPoint
│   └── vite.config.ts  # Vite config
├── package.json        # Package manifest including prettier, eslint, etc. configs
└── tsconfig.json       # TypeScript config
```

### License

This project is licensed under the WTFPL License.

```
            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.
```

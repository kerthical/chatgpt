<div align="center">
    <h1>ChatGPT</h1>
    <p><b>ChatGPT clone with an API key that has no destination other than OpenAI's servers</b></p>
    <p>Statically hosted on <a href="https://chat.kerthical.com">https://chat.kerthical.com</a></p>
</div>

<p align="center">
    <img alt="GitHub License" src="https://img.shields.io/github/license/kerthical/chatgpt?style=for-the-badge">
</p>

# ChatGPT

### Features

- [x] GPT-3.5, GPT-4
- [x] Content retrieval from Text files, PDF
- [x] Image understanding
- [x] Custom instruction
- [x] Chat history (Stored in browser)

### Self-hosting guide

The following command will generate static files in the `./dist` directory. You can open it on your local host or any
hosting service.

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
│   ├── app             # Framework specific code (in this case, routing components)
│   ├── assets          # Static assets (favicons, robots.txt, etc.)
│   ├── components      # Reusable components
│   ├── hooks           # Custom hooks
│   ├── locales         # Localization files and translator utils
│   ├── stores          # Global stores (using jotai)
│   ├── types           # Global types
│   ├── index.html      # EntryPoint
│   └── vite.config.ts  # Vite config
├── package.json        # Package manifest including prettier, eslint, etc. configs
└── tsconfig.json       # TypeScript config
```

### License

This project is licensed under the WTFPL License - see the [LICENSE](LICENSE) file for details

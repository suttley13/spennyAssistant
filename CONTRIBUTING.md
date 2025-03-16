# Contributing to Spenny Assistant

Thank you for considering contributing to Spenny Assistant! This document outlines the process for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue on GitHub with the following information:

- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment information (browser, OS, etc.)

### Suggesting Features

If you have an idea for a new feature, please create an issue on GitHub with the following information:

- A clear, descriptive title
- A detailed description of the feature
- Any relevant mockups or examples
- Why this feature would be useful to the project

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add some feature'`)
6. Push to the branch (`git push origin feature/your-feature-name`)
7. Create a new Pull Request

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spenny-assistant.git
cd spenny-assistant
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

4. Start the development servers:
```bash
npm run dev
```

## Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Write meaningful commit messages
- Document new functions and components
- Add tests for new features

## Testing

- Run tests before submitting a pull request
- Add tests for new features
- Ensure all tests pass

## Deployment

The project is automatically deployed to Firebase Hosting when changes are pushed to the main branch. See the GitHub Actions workflow for details.

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License. 
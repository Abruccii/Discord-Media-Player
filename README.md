<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Abruccii/Discord-Media-Player">
    <img src="https://i.imgur.com/kRVXsMe.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Discord Media Player</h3>

  <p align="center">
    DMP allows you to send Audio and Video from multiple sources to your Discord Server.
    <br />
    <a href="https://github.com/Abrucci/Discord-Media-Player/"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Abruccii/Discord-Media-Player/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/Abruccii/Discord-Media-Player/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Here's a blank template to get started: To avoid retyping too much info. Do a search and replace with your text editor for the following: `Abruccii`, `Discord-Media-Player`, `twitter_handle`, `linkedin_username`, `email_client`, `email`, `project_title`, `project_description`

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

[![Node][Node.js]][Node-url]
[![Next][Next.js]][Next-url]
[![TypeScript][TypeScript.com]][TypeScript-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This bot uses discord.js and discord.js-selfbot. Please be aware that this will likely be against the Discord ToS and may get your Selfbot Account banned! There are a few steps to setup before you can use this bot.

### Prerequisites

For this bot to work, we recommend you to use the latest Node.JS Version instead of any LTS.
* Latest Node.JS with NPM installed
* Having FFMPEG installed in case you want to send Video. (ffmpeg and ffprobe command must work in either CMD or Bash)
* You need to create a Discord Bot, store Client ID and Bot Token in `config.js` and invite the bot to your server. [Discord Developer Portal](https://discord.com/developers)
* You need to create a Selfbot Token (for example by logging in to a Discord Acocunt from incognito browser and pasting following command in browser console) and store it in `config.js`
```
window.webpackChunkdiscord_app.push([
  [Math.random()],
  {},
  req => {
    if (!req.c) return;
    for (const m of Object.keys(req.c)
      .map(x => req.c[x].exports)
      .filter(x => x)) {
      if (m.default && m.default.getToken !== undefined) {
        return copy(m.default.getToken());
      }
      if (m.getToken !== undefined) {
        return copy(m.getToken());
      }
    }
  },
]);
console.log('%cWorked!', 'font-size: 50px');
console.log(`%cYou now have your token in the clipboard!`, 'font-size: 16px');
```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Abruccii/Discord-Media-Player.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Copy src/config.example.js to src/config.js and change the values
4. Build the bot
   ```sh
   npm run build
   ```
5. Start the bot
   ```sh
   npm run start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Run the bot directly with node or via pm2:
> npm run yeet



<!-- ROADMAP -->
## Roadmap

- [ ] Search local folder for Mediafiles (like your local Plex/Jellyfin Library, rClone Cloud Mounts, RAIDrive Mounts and so on)
- [ ] Support Radio Streams
    - [ ] by URL
    - [ ] ny Name

See the [open issues](https://github.com/Abruccii/Discord-Media-Player/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/Abruccii/Discord-Media-Player/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Abruccii/Discord-Media-Player" alt="contrib.rocks image" />
</a>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact
niklas@bitcircuit.eu

Project Link: [https://github.com/Abruccii/Discord-Media-Player](https://github.com/Abruccii/Discord-Media-Player)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Abruccii/Discord-Media-Player.svg?style=for-the-badge
[contributors-url]: https://github.com/Abruccii/Discord-Media-Player/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Abruccii/Discord-Media-Player.svg?style=for-the-badge
[forks-url]: https://github.com/Abruccii/Discord-Media-Player/network/members
[stars-shield]: https://img.shields.io/github/stars/Abruccii/Discord-Media-Player.svg?style=for-the-badge
[stars-url]: https://github.com/Abruccii/Discord-Media-Player/stargazers
[issues-shield]: https://img.shields.io/github/issues/Abruccii/Discord-Media-Player.svg?style=for-the-badge
[issues-url]: https://github.com/Abruccii/Discord-Media-Player/issues
[license-shield]: https://img.shields.io/github/license/Abruccii/Discord-Media-Player.svg?style=for-the-badge
[license-url]: https://github.com/Abruccii/Discord-Media-Player/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
[TypeScript.com]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=nodedotjs&logo
[node-url]: https://nodejs.org/
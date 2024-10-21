<h1 align="center">
	<img
		width="300"
		alt="DMP"
		src="https://i.imgur.com/C5lny57.png?sanitize=true">
</h1>

<h3 align="center">
	Discord Movie Player (SelfBot)
</h3>

<p align="center">
	<strong>
		<a href="#">Docs</a>
		•
		<a href="#">Docker</a>
	</strong>
</p>


##### Based on [@dank074/Discord-video-stream](https://github.com/dank074/Discord-video-stream)

> WARNING: This Bot will likely break Discord ToS. Never use tokens from your main Account!

### Features:
- Stream Audio and Video to Discord (like .mp3, .mp4, .mkv) form either local Filesystem or URL
- Provide local directory for search and playback (like movie and tv show folder from plex/jellyfin)
- Extended Commands via Discord Bot (like play, pause, resume, stop, search and so on)
- Discord Status Information on currently playing Stream
  
### Requirements:
- NodeJS
- Discord Bot Token (for Bot Commands) [https://discord.com/developers]
- Discord Client Token for Selfbot (cause Bots can't stream video)
> Copy following Code into Browser Console while Discord opened and logged in to get Selfbot Token
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

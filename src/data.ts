import rainBg from './assets/rainy-bg.jpg';
import summerBg from './assets/summer-bg.jpg';
import winterBg from './assets/winter-bg.jpg';
import rainIcon from './assets/icons/cloud-rain.svg';
import summerIcon from './assets/icons/sun.svg';
import winterIcon from './assets/icons/cloud-snow.svg';
import pauseIcon from './assets/icons/pause.svg';
import rainSound from './assets/sounds/rain.mp3';
import summerSound from './assets/sounds/summer.mp3';
import winterSound from './assets/sounds/winter.mp3';

export enum dataBgs {
  summer = summerBg,
  rain = rainBg,
  winter = winterBg,
}

export enum dataIcons {
  summer = summerIcon,
  rain = rainIcon,
  winter = winterIcon,
  pause = pauseIcon,
}

export enum dataSounds {
  summer = summerSound,
  rain = rainSound,
  winter = winterSound,
}

export enum soundState {
  play = 1,
  pause,
  stop,
}

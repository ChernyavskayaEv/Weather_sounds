import './index.html';
import './styles.scss';
import { dataBgs, dataIcons, dataSounds, soundState } from './data';

interface ButtonDate {
  name: string;
  background: dataBgs;
  icon: dataIcons;
  sound: dataSounds;
}

class Button {
  name: string;
  element: HTMLDivElement;
  image: HTMLImageElement;
  iconWeather: dataIcons;
  iconPause: dataIcons = dataIcons.pause;
  isPaused: boolean = false;

  constructor(date: ButtonDate) {
    this.name = date.name;
    this.element = document.createElement('div');
    this.element.className = `button ${date.name}`;
    this.element.style.backgroundImage = `url(${date.background})`;
    this.image = document.createElement('img');
    this.image.className = `icon ${date.name}-icon`;
    this.image.src = `${date.icon}`;
    this.image.alt = `${date.name}`;
    this.element.append(this.image);

    this.iconWeather = date.icon;
  }

  changeIcon() {
    this.image.src = this.isPaused
      ? `${this.iconPause}`
      : `${this.iconWeather}`;
  }

  changePlayPause(isPaused: boolean) {
    if (this.isPaused !== isPaused) {
      this.isPaused = isPaused;
      this.changeIcon();
    }
  }
}

class Sound {
  name: string;
  audioCtx: AudioContext;
  soundUrl: string;
  volume: GainNode;
  source!: AudioBufferSourceNode;
  _state: soundState;
  // ready: Promise<void>;

  static audioCtx: AudioContext = new AudioContext();
  static volume: GainNode = this.audioCtx.createGain();

  constructor(date: ButtonDate) {
    this.name = date.name;
    this.audioCtx = Sound.audioCtx;
    this.soundUrl = date.sound.toString();
    this.volume = Sound.volume;
    this._state = soundState.stop;
    // this.ready = this.init();
  }

  async init() {
    const data = await fetch(this.soundUrl);
    const buffer = await data.arrayBuffer();
    const decoded = await this.audioCtx.decodeAudioData(buffer);

    this.source = this.audioCtx.createBufferSource();
    this.source.buffer = decoded;

    this.source.connect(this.volume);
    this.volume.connect(this.audioCtx.destination);
  }

  async play() {
    try {
      if (this._state === soundState.stop) {
        await this.init();

        // this.ready;

        this.source.start();

        this._state = soundState.play;
      }
      if (this._state === soundState.pause) {
        this.audioCtx.resume();
        this._state = soundState.play;
      }
    } catch (error) {
      console.log(error);
    }
  }

  pause() {
    if (this._state === soundState.play) {
      this.audioCtx.suspend();
      this._state = soundState.pause;
    }
  }

  async stop() {
    this.source.stop();
    this._state = soundState.stop;

    this.audioCtx.state === 'suspended' && this.audioCtx.resume();
  }

  get state() {
    return this._state;
  }

  static set setVolume(value: number) {
    const currentValue = ((value - 0) * (1 - 0)) / (100 - 1);
    this.volume.gain.value = currentValue;
  }
}

const buttonsname: string[] = ['summer', 'rain', 'winter'];

export const buttonsDate: ButtonDate[] = buttonsname.map((name) => {
  return {
    name: name,
    background: dataBgs[name as keyof typeof dataBgs],
    icon: dataIcons[name as keyof typeof dataIcons],
    sound: dataSounds[name as keyof typeof dataSounds],
  };
});

class WorkingWithButton {
  wearherImage: HTMLElement | null = document.querySelector('.wearher-image');

  soundsBox: HTMLElement | null = document.querySelector('.sounds-box');

  exNameOfButton: string = 'summer';
  buttonsContent: Button[];
  buttonsSound: Sound[];

  constructor(buttonsDate: ButtonDate[]) {
    this.buttonsContent = buttonsDate.map((button) => new Button(button));
    this.buttonsSound = buttonsDate.map((button) => new Sound(button));

    this.buttonsContent.forEach((button) => {
      this.soundsBox!.append(button.element);

      button.element.addEventListener('click', () => {
        const exButton = this.buttonsContent.find(
          (button) => button.name === this.exNameOfButton
        );

        const exSound = this.buttonsSound.find(
          (sound) => sound.name === this.exNameOfButton
        );

        const sound = this.buttonsSound.find(
          (sound) => sound.name === button.name
        );

        const currentButton = button;

        // sound!.ready.then(() => {
        //   sound!.source.addEventListener('ended', () => {
        //     currentButton.changePlayPause(false);
        //     sound!._state = soundState.stop;
        //   });
        // });

        this.eventsOfButtons(exButton, exSound!, currentButton, sound!);
      });
    });
  }

  eventsOfButtons(
    exButton: Button | undefined,
    exSound: Sound,
    currentButton: Button,
    sound: Sound
  ): void {
    if (exButton!.name === currentButton.name) {
      this.changePlayPauseButton(currentButton, sound);
    } else {
      this.changeBackground(currentButton.name);
      this.exNameOfButton = currentButton.name;
      this.stopButton(exButton, exSound!);
      this.changePlayPauseButton(currentButton, sound);
    }
  }

  changePlayPauseButton(button: Button, sound: Sound): void {
    if (!button.isPaused) {
      button.changePlayPause(true);
      sound.play();
    } else {
      button.changePlayPause(false);
      sound.pause();
    }
  }

  stopButton(button: Button | undefined, sound: Sound | undefined): void {
    button!.changePlayPause(false);
    sound!.stop();
  }

  changeBackground(currentNameOfButton: string): void {
    const currentBackground =
      dataBgs[currentNameOfButton as keyof typeof dataBgs];

    this.wearherImage!.className = `wearher-image ${currentNameOfButton}`;
    this.wearherImage!.style.backgroundImage = `url(${currentBackground})`;
  }
}

function createVolumeControl() {
  const volumeBox = document.querySelector('.volume');
  const slider = document.createElement('input');
  slider.className = 'slider';
  slider.type = 'range';
  slider.min = '0';
  slider.max = '100';

  slider.addEventListener('input', (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    Sound.setVolume = Number(value);
  });

  volumeBox!.append(slider);
}

const workingWithButton = new WorkingWithButton(buttonsDate);
createVolumeControl();

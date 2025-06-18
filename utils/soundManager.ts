// Sound utility functions for the Astrovert app
// Using expo-av for audio functionality
import { Audio, AVPlaybackStatus } from 'expo-av';

// Sound effects enum
export enum SoundType {
  COLLISION = 'collision',
  POWER_UP = 'powerUp',
  SCORE_UP = 'scoreUp',
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
  COMPLETE = 'complete',
  BUTTON_CLICK = 'buttonClick',
  GAME_BACKGROUND = 'gameBackground',
  SPACE_AMBIENT = 'spaceAmbient',
}

// Sound file mapping
const SOUND_FILES = {
  [SoundType.COLLISION]: require('../assets/audio/collision.mp3'),
  [SoundType.POWER_UP]: require('../assets/audio/powerup.mp3'),
  [SoundType.SCORE_UP]: require('../assets/audio/scoreup.mp3'),
  [SoundType.CORRECT]: require('../assets/audio/correct.mp3'),
  [SoundType.INCORRECT]: require('../assets/audio/wrong.mp3'),
  [SoundType.COMPLETE]: require('../assets/audio/complete.mp3'),
  [SoundType.BUTTON_CLICK]: require('../assets/audio/bottonclick.mp3'),
  [SoundType.GAME_BACKGROUND]: require('../assets/audio/gamebackgound.mp3'),
  [SoundType.SPACE_AMBIENT]: require('../assets/audio/spaceambient.mp3'),
};

// Sound manager class
export class SoundManager {
  private sounds: Map<SoundType, Audio.Sound> = new Map();
  private soundsLoaded = false;

  constructor() {
    this.initializeSounds();
  }  private async initializeSounds() {
    try {
      // Set audio mode for mobile
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Load all sound files
      for (const [soundType, soundFile] of Object.entries(SOUND_FILES)) {
        try {
          const { sound } = await Audio.Sound.createAsync(soundFile);
          this.sounds.set(soundType as SoundType, sound);
          console.log(`Loaded sound: ${soundType}`);
        } catch (error) {
          console.log(`Failed to load sound ${soundType}:`, error);
        }
      }
      
      this.soundsLoaded = true;
      console.log('Sound manager initialized successfully');
    } catch (error) {
      console.log('Error initializing sound manager:', error);
    }
  }
  async playSound(soundType: SoundType, volume: number = 1.0): Promise<void> {
    try {
      const sound = this.sounds.get(soundType);
      if (sound) {
        await sound.setVolumeAsync(volume);
        await sound.replayAsync();
      }
    } catch (error) {
      console.log(`Error playing sound ${soundType}:`, error);
    }
  }

  async stopSound(soundType: SoundType): Promise<void> {
    try {
      const sound = this.sounds.get(soundType);
      if (sound) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.log(`Error stopping sound ${soundType}:`, error);
    }
  }

  async setVolume(soundType: SoundType, volume: number): Promise<void> {
    try {
      const sound = this.sounds.get(soundType);
      if (sound) {
        await sound.setVolumeAsync(volume);
      }
    } catch (error) {
      console.log(`Error setting volume for sound ${soundType}:`, error);
    }
  }

  async unloadAllSounds(): Promise<void> {
    try {
      const unloadPromises = Array.from(this.sounds.values()).map(sound => 
        sound.unloadAsync().catch((error: any) => 
          console.log('Error unloading sound:', error)
        )
      );
      
      await Promise.all(unloadPromises);
      this.sounds.clear();
      this.soundsLoaded = false;
    } catch (error) {
      console.log('Error unloading sounds:', error);
    }
  }

  async pauseSound(soundType: SoundType): Promise<void> {
    try {
      const sound = this.sounds.get(soundType);
      if (sound) {
        await sound.pauseAsync();
      }
    } catch (error) {
      console.log(`Error pausing sound ${soundType}:`, error);
    }
  }

  async resumeSound(soundType: SoundType): Promise<void> {
    try {
      const sound = this.sounds.get(soundType);
      if (sound) {
        await sound.playAsync();
      }
    } catch (error) {
      console.log(`Error resuming sound ${soundType}:`, error);
    }
  }

  async playLoopingSound(soundType: SoundType, volume: number = 1.0): Promise<void> {
    try {
      const sound = this.sounds.get(soundType);
      if (sound) {
        await sound.setVolumeAsync(volume);
        await sound.setIsLoopingAsync(true);
        await sound.playAsync();
      }
    } catch (error) {
      console.log(`Error playing looping sound ${soundType}:`, error);
    }
  }

  async stopLoopingSound(soundType: SoundType): Promise<void> {
    try {
      const sound = this.sounds.get(soundType);
      if (sound) {
        await sound.setIsLoopingAsync(false);
        await sound.stopAsync();
      }
    } catch (error) {
      console.log(`Error stopping looping sound ${soundType}:`, error);
    }
  }

  // Check if sound manager is ready
  isSoundsLoaded(): boolean {
    return this.soundsLoaded;
  }

  // Get loaded sound types
  getLoadedSounds(): SoundType[] {
    return Array.from(this.sounds.keys());
  }
}

// Global sound manager instance
export const soundManager = new SoundManager();

// Convenience functions
export const playSound = (soundType: SoundType, volume?: number) => 
  soundManager.playSound(soundType, volume);

export const stopSound = (soundType: SoundType) => 
  soundManager.stopSound(soundType);

export const pauseSound = (soundType: SoundType) => 
  soundManager.pauseSound(soundType);

export const resumeSound = (soundType: SoundType) => 
  soundManager.resumeSound(soundType);

export const playLoopingSound = (soundType: SoundType, volume?: number) => 
  soundManager.playLoopingSound(soundType, volume);

export const stopLoopingSound = (soundType: SoundType) => 
  soundManager.stopLoopingSound(soundType);

export const setVolume = (soundType: SoundType, volume: number) => 
  soundManager.setVolume(soundType, volume);

export const isSoundsLoaded = () => 
  soundManager.isSoundsLoaded();

export const getLoadedSounds = () => 
  soundManager.getLoadedSounds();

// Audio configuration
export const configureAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    console.log('Audio configuration completed');
  } catch (error) {
    console.log('Error configuring audio:', error);
  }
};

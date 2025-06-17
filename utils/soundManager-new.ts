// Sound utility functions for the Astrovert app
// Using a simplified sound system compatible with SDK 53

// Sound effects enum
export enum SoundType {
  COLLISION = 'collision',
  POWER_UP = 'powerUp',
  SCORE_UP = 'scoreUp',
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
  COMPLETE = 'complete',
  BUTTON_CLICK = 'buttonClick',
}

// Mock sound interface for fallback
interface MockSound {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  remove: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
}

// Sound manager class
export class SoundManager {
  private sounds: Map<SoundType, MockSound> = new Map();
  private soundsLoaded = false;

  constructor() {
    this.initializeSounds();
  }

  private async initializeSounds() {
    try {
      const soundTypes = Object.values(SoundType);
      
      for (const soundType of soundTypes) {
        try {
          // Create a mock sound object that provides the interface but doesn't actually play
          const mockSound: MockSound = {
            play: async () => {
              console.log(`Playing sound: ${soundType}`);
            },
            pause: async () => {
              console.log(`Pausing sound: ${soundType}`);
            },
            stop: async () => {
              console.log(`Stopping sound: ${soundType}`);
            },
            remove: async () => {
              console.log(`Removing sound: ${soundType}`);
            },
            seekTo: async (position: number) => {
              console.log(`Seeking sound ${soundType} to position: ${position}`);
            },
            setVolume: async (volume: number) => {
              console.log(`Setting volume for ${soundType}: ${volume}`);
            },
          };
          
          this.sounds.set(soundType as SoundType, mockSound);
        } catch (error) {
          console.log(`Failed to load sound ${soundType}:`, error);
        }
      }
      
      this.soundsLoaded = true;
      console.log('Sound manager initialized with mock sounds');
    } catch (error) {
      console.log('Error initializing sound manager:', error);
    }
  }

  async playSound(soundType: SoundType, volume: number = 1.0): Promise<void> {
    try {
      const sound = this.sounds.get(soundType);
      if (sound) {
        await sound.setVolume(volume);
        await sound.play();
      }
    } catch (error) {
      console.log(`Error playing sound ${soundType}:`, error);
    }
  }

  async stopSound(soundType: SoundType): Promise<void> {
    try {
      const sound = this.sounds.get(soundType);
      if (sound) {
        await sound.stop();
      }
    } catch (error) {
      console.log(`Error stopping sound ${soundType}:`, error);
    }
  }

  async setVolume(soundType: SoundType, volume: number): Promise<void> {
    try {
      const sound = this.sounds.get(soundType);
      if (sound) {
        await sound.setVolume(volume);
      }
    } catch (error) {
      console.log(`Error setting volume for sound ${soundType}:`, error);
    }
  }

  async unloadAllSounds(): Promise<void> {
    try {
      const unloadPromises = Array.from(this.sounds.values()).map(sound => 
        sound.remove().catch((error: any) => 
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
}

// Global sound manager instance
export const soundManager = new SoundManager();

// Convenience functions
export const playSound = (soundType: SoundType, volume?: number) => 
  soundManager.playSound(soundType, volume);

export const stopSound = (soundType: SoundType) => 
  soundManager.stopSound(soundType);

export const setVolume = (soundType: SoundType, volume: number) => 
  soundManager.setVolume(soundType, volume);

// Audio configuration - simplified for SDK 53
export const configureAudio = async () => {
  try {
    console.log('Audio configuration completed (mock implementation)');
    // In a real implementation, you would use expo-audio configuration here
  } catch (error) {
    console.log('Error configuring audio:', error);
  }
};

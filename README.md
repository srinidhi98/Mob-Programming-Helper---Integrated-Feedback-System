# Feedback System : Mob-Programming-ITS
#Focues on the activity surveillance of the students participating in Mob Programming
# Speaker Recognition - Sub Module within the Mob Programming System

## About

This project is a Python-based speaker recognition system that can identify the most active speaker in an audio dataset using the LibriSpeech dataset. The system calculates the total speaking time for each speaker and then identifies the speaker with the highest activity.

Speaker recognition, also known as voice recognition or speaker identification, is the process of automatically recognizing the identity of a person based on their voice. This technology has various applications, including security systems, voice assistants, and forensic investigations.

## Dataset

The speaker recognition system uses the [LibriSpeech dataset](https://www.openslr.org/12/), which is a popular dataset for speech-related tasks. LibriSpeech contains a large collection of English read speech data from a variety of speakers. It is widely used in the speech processing and machine learning research communities.

The dataset is preprocessed and organized into folders, each representing a speaker, with audio files containing their speech. The audio files are in the WAV format and can be loaded using the `librosa` library in Python.

## Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/speaker-recognition.git
cd speaker-recognition
**Install the required packages:**
pip install pandas librosa
**Usage**
Prepare your LibriSpeech dataset by downloading it from here and organizing it into speaker-specific folders. Each speaker folder should contain their respective audio files.

Update the data_path variable in the speaker_recognition.py script to point to the location of your dataset.

Run the speaker recognition script:
python speaker_recognition.py
The script will calculate the total speaking time for each speaker and display the speaker with the highest activity (i.e., speaking the most) in the dataset.

Results
The output of the script will show the speaker ID or name with the highest speaking time in the LibriSpeech dataset. This speaker is considered the most active speaker.

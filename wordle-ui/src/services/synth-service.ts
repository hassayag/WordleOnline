import * as Tone from 'tone';

class SynthService {
    private synth: Tone.Synth;

    private letters = [
        'q',
        'w',
        'e',
        'r',
        't',
        'y',
        'u',
        'i',
        'o',
        'p',
        'a',
        's',
        'd',
        'f',
        'g',
        'h',
        'j',
        'k',
        'l',
        'z',
        'x',
        'c',
        'v',
        'b',
        'n',
        'm',
    ];
    private scales = {
        majorPent: ['C', 'D', 'E', 'G', 'A'],
        minorPent: ['C', 'Eb', 'F', 'G', 'Bb'],
    };
    private loops: Loop[] = [];

    constructor() {
        Tone.start();
        this.synth = new Tone.Synth().toDestination();
    }

    startLoop(letters: string[]) {
        const notes = letters.map((letter) => this.getPitch(letter));
        console.debug({ letters, notes });

        const loop = new Loop(notes as any);
        loop.start();

        this.loops.push(loop);
    }

    stopLoops() {
        this.loops.forEach((loop) => loop.stop());
    }

    triggerSound(letter: string) {
        const pitch = this.getPitch(letter);
        if (!pitch) {
            return;
        }

        const now = Tone.now();
        this.synth.triggerAttackRelease(pitch, 0.5, now + 0.1);
    }

    getPitch(letter: string) {
        const index = this.letters.findIndex((l) => l === letter);
        if (index === -1) {
            return;
        }

        const quotient = Math.floor(index / this.scales.minorPent.length),
            remainder = index % this.scales.minorPent.length;

        const register = quotient + 2,
            pitch = this.scales.minorPent[remainder];

        return `${pitch}${register}`;
    }

    setEnvelope(envelope: any) {
        console.debug('updating envelopes for ', this.loops.length);
        this.loops.forEach((loop) => loop.synth.set({ envelope }));
    }
}

class Loop {
    public synth: Tone.Synth;
    private notes: string[];
    private transport: typeof Tone.Transport;

    constructor(notes: string[]) {
        const envelope = {
            attack: 0,
            decay: 0.2,
            sustain: 1,
            release: 0.05,
        };

        this.synth = new Tone.Synth({ envelope }).toDestination();
        this.notes = notes;
        this.transport = Tone.Transport;

        this.buildLoop();
    }

    buildLoop() {
        this.transport.scheduleRepeat((time) => {
            for (let i = 0; i < this.notes.length; i++) {
                const length = Math.random() / 5;
                this.synth.triggerAttackRelease(
                    this.notes[i],
                    length,
                    time + 0.2 * i
                );
            }
        }, '1n');
    }

    start() {
        this.transport.start();
    }

    stop() {
        this.transport.stop();
    }
}

const synth = new SynthService();
export default synth;

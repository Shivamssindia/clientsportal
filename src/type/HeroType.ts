type Hero = {
    video   : string;
    badge   : string;
    title   : string;
    desc    : string;
    buttons : {
        Explore : string;
        start : string;
    };
    stats : {
        num : string;
        lbl : string;
    }[];
}

type HeroProps = {
    heroData : Hero;
}

export type { Hero, HeroProps };



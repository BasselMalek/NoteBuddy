const DURATIONBASE = 10;
const DURATIONBONUS1 = 5,
    DURATIONBONUS2 = 10,
    DURATIONBONUS3 = 15;

const RATINGBONUS = {
    R1: 2,
    R2: 3,
    R3: 5,
    R4: 7,
    R5: 10,
};
const CONSISTBONUS = {
    S0: 1.0,
    S1: 1.15,
    S2: 1.25,
    S3: 1.35,
    S4: 1.5,
    S5: 1.6,
    S6: 1.75,
    S7: 2.0,
};

function usePoints(
    duration: number,
    rating: number,
    consistency: number
): number {
    //Duration-based bonuses w/ 15+/30mins
    let dailyPoints =
        DURATIONBASE +
        +(duration <= 45) * DURATIONBONUS1 +
        +(duration <= 60) * DURATIONBONUS1 +
        +(duration <= 75) * DURATIONBONUS1 +
        +(duration <= 105) * DURATIONBONUS2 +
        +(duration <= 135) * DURATIONBONUS3;
    if (duration > 135) {
        duration -= 135;
        while (duration > 1) {
            dailyPoints += DURATIONBONUS3;
            duration -= 30;
        }
    }

    //Rating bonuses
    switch (rating) {
        case 1:
            dailyPoints += RATINGBONUS.R1;
            break;
        case 2:
            dailyPoints += RATINGBONUS.R2;
            break;
        case 3:
            dailyPoints += RATINGBONUS.R3;
            break;
        case 4:
            dailyPoints += RATINGBONUS.R4;
            break;
        case 5:
            dailyPoints += RATINGBONUS.R5;
            break;
        default:
            break;
    }

    //Consistency
    switch (consistency) {
        case 1:
            dailyPoints += dailyPoints * CONSISTBONUS.S1;
            break;
        case 2:
            dailyPoints += dailyPoints * CONSISTBONUS.S2;
            break;
        case 3:
            dailyPoints += dailyPoints * CONSISTBONUS.S3;
            break;
        case 4:
            dailyPoints += dailyPoints * CONSISTBONUS.S4;
            break;
        case 5:
            dailyPoints += dailyPoints * CONSISTBONUS.S5;
            break;
        case 6:
            dailyPoints += dailyPoints * CONSISTBONUS.S6;
            break;
        case 7:
            dailyPoints += dailyPoints * CONSISTBONUS.S7;
            break;
        default:
            break;
    }

    return dailyPoints;
}

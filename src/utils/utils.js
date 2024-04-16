export const getRNG = (min, max)=> {
    return Math.floor(Math.random() * (max - min) + min)
}
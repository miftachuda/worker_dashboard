// @ts-nocheck
function Vibration(name, note, ma = 0, mv1 = 0, mh1 = 0, mv2 = 0, mh2 = 0, pa = 0, pv1 = 0, ph1 = 0, pv2 = 0, ph2 = 0) {
    this.name = name;
    this.note = note;
    this.vibration =
        [{
            ma: ma,
            mv1: mv1,
            mh1: mh1,
            mv2: mv2,
            mh2: mh2,
            pa: pa,
            pv1: pv1,
            ph1: ph1,
            pv2: pv2,
            ph2: ph2
        }]
        ;
}
export default Vibration
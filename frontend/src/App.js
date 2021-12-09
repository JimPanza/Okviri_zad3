import React, { useState, useEffect } from 'react'
import Poruka from './components/Ispis'
import porukeAkcije from './services/poruke'
import './index.css'

const App = () => {

    const sum = (obj) => {
        var sum = 0;
        for (var el in obj) {
            obj[el].vrsta === "Prihod" ? sum += obj[el].iznos : sum -= obj[el].iznos
        }
        return (Math.round(sum * 100) / 100).toFixed(2);
    }

    const [inputVisible, setInputVisible] = useState(false)
    const [transakcije, postaviTransakcije] = useState([])
    const [unosOpis, postaviUnosOpis] = useState("")
    const [unosIznos, postaviUnosIznos] = useState("")
    const [radioPrihod, postaviRadioPrihod] = useState(false)
    const [radioRashod, postaviRadioRashod] = useState(false)
    const [ispisSve, postaviIspis] = useState(true)
    const [ispisPrihodi, postaviIspisPrihodi] = useState(false)
    const [ispisRashodi, postaviIspisRashodi] = useState(false)
    const [total, postaviTotal] = useState(sum(transakcije))
    const [urediPoljeId, postaviUrediPoljeId] = useState(null)
    const [unosPromjene, postaviUnosPromjene] = useState("")

    const porukeZaIspis = ispisSve ?
        transakcije :
        (ispisPrihodi ? transakcije.filter(poruka => poruka.vrsta === "Prihod") :
            transakcije.filter(poruka => poruka.vrsta === "Rashod"))

    useEffect(() => {
        porukeAkcije.dohvatiSve().then(res => { postaviTransakcije(res.data) })
    }, [])
    
    useEffect(() => {
        postaviTotal(sum(porukeZaIspis))
    }, [porukeZaIspis]
    )

    const promjeniUnosPromjene = (unos) => {
        if (!isNaN(unos.target.value || unos.target.value === ".")) {
            postaviUnosPromjene(unos.target.value)
        }
    }

    const cancelPromjenu = () => {
        postaviUnosPromjene("")
        postaviUrediPoljeId(null)
    }

    const postaviTipIspisa = (tip) => {
        if (tip.target.value === "prihodi") {
            postaviIspisPrihodi(true)
            postaviIspisRashodi(false)
            postaviIspis(false)
        }
        else if (tip.target.value === "rashodi") {
            postaviIspisPrihodi(false)
            postaviIspisRashodi(true)
            postaviIspis(false)
        }
        else {
            postaviIspisPrihodi(false)
            postaviIspisRashodi(false)
            postaviIspis(true)
        }
    }

    const rtb = (e) => {
        if (e.target.value === "Prihod") {
            postaviRadioPrihod(true)
            postaviRadioRashod(false)
        }
        else if (e.target.value === "Rashod") {
            postaviRadioRashod(true)
            postaviRadioPrihod(false)
        }
    }

    const brisiTrosak = (id) => {
        porukeAkcije.brisi(id)
            .then(response => {
                console.log(response);
                postaviTransakcije(transakcije.filter(p => p.id !== id));
            })
    }

    const urediTrosak = (id) => {
        if (urediPoljeId === null || urediPoljeId !== id) {
            postaviUrediPoljeId(id)
        }
        else {
            postaviUrediPoljeId(null)
        }
    }

    const novaPoruka = (e) => {
        var date = new Date()
        e.preventDefault()

        if (radioPrihod === false && radioRashod === false) {
            return
        }
        var vrst = radioPrihod ? "Prihod" : "Rashod"

        const noviObjekt = {
            vrsta: vrst,
            datum: date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate(),
            opis: unosOpis,
            iznos: Number((Math.round(unosIznos * 100) / 100).toFixed(2))
        }
        porukeAkcije.stvori(noviObjekt)
            .then(res => {
                postaviTransakcije(transakcije.concat(res.data))
                postaviUnosIznos('')
                postaviUnosOpis('')
                setInputVisible(false)
            })
    }

    const promjeniIznos = (id) => {
        if (unosPromjene === ""){
            return
        }

        const transakcija = transakcije.find(p => p.id === id)
        const modPoruka = {
            ...transakcija,
            iznos: Number((Math.round(unosPromjene * 100) / 100).toFixed(2))
        }

        porukeAkcije.osvjezi(id, modPoruka)
            .then(response => {
                console.log(response)
                postaviTransakcije(transakcije.map(p => p.id !== id ? p : response.data))
                postaviUnosPromjene("")
                postaviUrediPoljeId(null)
            })
    }

    const resetUnos = () => {
        postaviUnosIznos('')
        postaviUnosOpis('')
        postaviRadioPrihod(false)
        postaviRadioRashod(false)
    }

    const promjenaOpis = (unos) => {
        postaviUnosOpis(unos.target.value)
    }

    const promjenaIznos = (unos) => {
        if (!isNaN(unos.target.value || unos.target.value === ".")) {
            postaviUnosIznos(unos.target.value)
        }
    }

    const showForm = () => {
        setInputVisible(!inputVisible)
        resetUnos()
    }

    return (
        <div className="glavni">
            <button onClick={showForm} className="btnNoviTrosak">Novi trošak</button>
            {inputVisible ?
                <form className="odabir" onSubmit={novaPoruka} onReset={resetUnos}>
                    <div className="odabirVrste">
                        <span className="titleVrsta">Vrsta troška:</span>
                        <div className="rtb">
                            <input type="radio" onClick={rtb} value="Prihod" name="vrsta" /> Prihod
                            <br />
                            <input type="radio" onClick={rtb} value="Rashod" name="vrsta" /> Rashod
                        </div>
                    </div>
                    <div>
                        <label className="inputField">
                            <span className="textInput">
                                Opis:
                                <input type="text" maxLength={30} value={unosOpis} onChange={promjenaOpis} /></span>
                            <br />
                            <span className="textInput">
                                Iznos:
                                <input type="text" value={unosIznos} onChange={promjenaIznos} /></span>
                        </label>
                        <div className="okCancel">
                            <button type="submit" style={{ backgroundColor: "green" }}>OK</button>
                            <button type="reset" value="CANCEL" style={{ backgroundColor: 'red' }}>Cancel</button>
                        </div>
                    </div>
                </form> : null}

            <div className="buttonsSort">
                <button className="btnPrihodi" onClick={postaviTipIspisa} value="prihodi">Samo prihodi</button>
                <button className="btnRashodi" onClick={postaviTipIspisa} value="rashodi">Samo rashodi</button>
                <button className="btnSve" onClick={postaviTipIspisa} value="sve">Sve transakcije</button>
            </div>
            <table>
                <thead>
                <tr>
                    <th>Vrsta</th>
                    <th>Datum</th>
                    <th>Opis</th>
                    <th>Opcije</th>
                    <th>Iznos</th>
                </tr>
                </thead>
                <tbody>
                {porukeZaIspis.map(p => <Poruka key={p.id}
                    por={p}
                    brisiTrosak={() => brisiTrosak(p.id)}
                    urediTrosak={() => urediTrosak(p.id)}
                    urediPoljeId={urediPoljeId}
                    promjenaIznosa={() => promjeniIznos(p.id)}
                    unosPromjene={promjeniUnosPromjene}
                    cancelPromjena={cancelPromjenu}
                    promjena={unosPromjene} />
                )}
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={total >= 0 ? "totalPlus" : "totalMinus"}>Ukupno:</td>
                        <td className={total >= 0 ? "totalPlus" : "totalMinus"}>{total > 0 ? "+" + (total) : total} kn</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default App
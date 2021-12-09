import React from 'react'
import './Ispis.css'

const Ispis = ({ por, brisiTrosak, urediTrosak, urediPoljeId,promjenaIznosa, unosPromjene, promjena, cancelPromjena }) => {

  return (
    <tr>
      <td className={por.vrsta}>{por.vrsta}</td>
      <td className={por.vrsta}>{por.datum}</td>
      <td className={por.vrsta}>{por.opis}</td>
      <td className={por.vrsta}>
        <span className="editDelete">
        <button onClick={urediTrosak}><span role="img" aria-label="edit">✏️</span></button>
        <button onClick={brisiTrosak}><span role="img" aria-label="delete">❌</span></button>
        </span>
      </td>
      <td className={por.vrsta+"iznos"}>{por.iznos} kn</td>
      {urediPoljeId === por.id ?
        <td className="edit">
          <input type="text" value={promjena} placeholder="< Novi iznos" onChange={unosPromjene}></input>
          <button onClick={promjenaIznosa} value="OK">OK</button>
          <button onClick={cancelPromjena} value="Cancel">Cancel</button>
        </td>
        : null}
    </tr>
  )
}

export default Ispis
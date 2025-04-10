import "../../styles/safesleep.css";

export default function SafeSleep() {
  return (
    <div className="safe_sleep">
      <h3 className="safe_sleep_header">Safe Sleep Practices Policy</h3>
      <div>
        <label>Child’s name:</label>
        <input type="text" />
        <label>Date of birth</label>
        <input type="date" />
      </div>

      <div>
        <label>Parent/Guardian name:</label>
        <input type="text" />
      </div>

      <p>Safe Sleep Practices/Policies:</p>
      <ol>
        <li>
          Infants will be placed on their backs in a crib to sleep unless a
          physician’s written statement authorizing another sleep position for
          that infant is provided. The written statement must include how the
          infant shall be placed to sleep and a time frame that the instructions
          are to be followed.
        </li>

        <li>
          Cribs shall be in compliance with CPCS and ASTM safety standards. They
          will be maintained in good repair and free from hazards.
        </li>

        <li>
          No objects will be placed in or on the crib with an infant. This
          includes, but is not limited to, covers, blankets, toys, pillows,
          quilts, comforters, bumper pads, sheepskins, stuffed toys, or other
          soft items.
        </li>

        <li>
          No objects will be attached to a crib with a sleeping infant, such as,
          but not limited to, crib gyms, toys, mirrors and mobiles.
        </li>

        <li>
          Only sleepers, sleep sacks and wearable blankets provided by the
          parent/guardian and that fit according to the commercial
          manufacturer’s guidelines and will not slip up around the infant’s
          face may be worn for the comfort of the sleeping infant.
        </li>

        <li>
          Individual crib bedding will be changed daily, or more often as
          needed, according to the rules. Bedding for cots/mats will be
          laundered daily or marked for individual use. If marked for individual
          use, the sheets/covers must be laundered weekly or more frequently if
          needed. This facility will adhere to the following practice:
          <span>
            <input type="text" />
          </span>
        </li>

        <li>
          Infants who arrive at the center asleep or fall asleep in other
          equipment, on the floor or elsewhere, will moved to a safety-approved
          crib for sleep.
        </li>

        <li>
          Swaddling will not be permitted, unless a physician’s written
          statement authorizing it for a particular infant is provided. The
          written statement must include instructions and a time frame for
          swaddling the infant.
        </li>

        <li>
          Wedges, other infant positioning devices and monitors will not be
          permitted unless a physician’s written statement authorizing its use
          for a particular infant is provided. The written statement must
          include instructions on how to use the device and a time frame for
          using it.
        </li>
      </ol>

      <p>
        I acknowledge that the director or designee has advised me of the safe
        sleep practices followed by the facility.
      </p>

      <div>
        <label>Signature</label>
        <input type="text" />
        <label>Date</label>
        <input type="date" />
      </div>
    </div>
  );
}

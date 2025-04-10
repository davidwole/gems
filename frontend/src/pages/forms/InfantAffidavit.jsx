import "../../styles/infantaffidavit.css";

export default function InfantAffidavit() {
  return (
    <div className="infant_affidavit_container">
      <h3 className="infant_affidavit_header">Infant Affidavit</h3>
      <div>
        <label>Name of Sponsor(if applicable)</label>
        <input type="text" />
      </div>
      <div>
        <label>Name of Provider/Center</label>
        <input type="text" />
      </div>
      <div>
        <label>Name of Infant</label>
        <input type="text" />
      </div>
      <div>
        <label>Infant Date of Birth</label>
        <input type="text" />
      </div>
      <div>
        <label>Name of Parent/Guardian</label>
        <input type="text" />
      </div>

      <p>According to USDA regulations, as an ....</p>

      <div>
        <label>Center/Provider will provide the following</label>
        <input type="text" />
      </div>

      <div>
        <label>Center/Provider will provide the following</label>
        <input type="text" />
      </div>

      <div>
        <label>Center/Provider will provide the following</label>
        <input type="text" />
      </div>

      <div className="divider"></div>

      <p>Parents/Guardians,</p>

      <p>Please check one of the following options below and sign this form:</p>
      <div>
        <input type="text" />
        <label>I would like ....</label>
      </div>
      <div>
        <input type="text" />
        <label>I will provide ....</label>
      </div>

      <div>
        <div>
          <input type="checkbox" />
          <label>
            Formula<sup>*</sup>
          </label>
          <label>Meat/Fish/Poultry/Eggs/Beans/Peas</label>
        </div>
      </div>

      <div>
        <div>
          <input type="checkbox" />
          <label>Cereal</label>
          <label>Cheese/Cottage Cheese/Yogurt</label>
        </div>
      </div>

      <div>
        <div>
          <input type="checkbox" />
          <label>Fruit</label>
          <label>Bread/Crackers/Breakfast Cereal</label>
        </div>
      </div>

      <div>
        <div>
          <input type="checkbox" />
          <label>Vegetable</label>
        </div>
      </div>

      <div>
        <div>
          <input type="text" />
          <label>Signature</label>
        </div>

        <div>
          <input type="date" />
          <label>Date</label>
        </div>
      </div>

      <p>
        <sup>*</sup>Any parent requesting any formula other than a USDA approved
        milk-based or soy-based iron-fortified formula be provided to their
        infant or any parent who provides any formula other than
      </p>
    </div>
  );
}

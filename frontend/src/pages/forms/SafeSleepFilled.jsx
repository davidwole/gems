import { useState, useEffect, useContext } from "react";
import "../../styles/safesleep.css";
import SignaturePadView from "../../components/SignaturePadView";
import { AuthContext } from "../../context/AuthContext";
import { createSafeSleep } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../services/api";

export default function SafeSleepFilled() {
  const { user, token } = useContext(AuthContext);
  const { userId } = useParams();
  const { enrollmentformId } = useParams();

  const navigate = useNavigate();
  // Define state for all form inputs
  const [formData, setFormData] = useState({
    user: "",
    childName: "",
    dateOfBirth: "",
    parentName: "",
    bedding: "",
    signature: "",
    signatureDate: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignature = (dataUrl) => {
    setFormData({
      ...formData,
      signature: dataUrl,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createSafeSleep(formData);
      if (response.success) {
        setTimeout(() => {
          setLoading(false);
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getForm = async () => {
    const response = await fetch(`${API_URL}/safe-sleep/${enrollmentformId}`);
    const json = await response.json();

    console.log(json);
    setFormData(json[0]);
  };

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        user: user.id,
      });
    }
  }, [user]);

  useEffect(() => {}, []);

  useEffect(() => {
    getForm();
  }, []);

  if (!formData) {
    return <div>Form not filled</div>;
  }

  return (
    <div className="safe_sleep">
      <h3 className="safe_sleep_header">Safe Sleep Practices Policy</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div>
            <label>Child's name:</label>
            <input
              type="text"
              name="childName"
              value={formData.childName}
              onChange={handleChange}
            />
            <label>Date of birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Parent/Guardian name:</label>
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
            />
          </div>
          <p>Safe Sleep Practices/Policies:</p>
          <ol>
            <li>
              Infants will be placed on their backs in a crib to sleep unless a
              physician's written statement authorizing another sleep position
              for that infant is provided. The written statement must include
              how the infant shall be placed to sleep and a time frame that the
              instructions are to be followed.
            </li>
            <li>
              Cribs shall be in compliance with CPCS and ASTM safety standards.
              They will be maintained in good repair and free from hazards.
            </li>
            <li>
              No objects will be placed in or on the crib with an infant. This
              includes, but is not limited to, covers, blankets, toys, pillows,
              quilts, comforters, bumper pads, sheepskins, stuffed toys, or
              other soft items.
            </li>
            <li>
              No objects will be attached to a crib with a sleeping infant, such
              as, but not limited to, crib gyms, toys, mirrors and mobiles.
            </li>
            <li>
              Only sleepers, sleep sacks and wearable blankets provided by the
              parent/guardian and that fit according to the commercial
              manufacturer's guidelines and will not slip up around the infant's
              face may be worn for the comfort of the sleeping infant.
            </li>
            <li>
              Individual crib bedding will be changed daily, or more often as
              needed, according to the rules. Bedding for cots/mats will be
              laundered daily or marked for individual use. If marked for
              individual use, the sheets/covers must be laundered weekly or more
              frequently if needed. This facility will adhere to the following
              practice:
              <span>
                <input
                  type="text"
                  name="bedding"
                  value={formData.bedding}
                  onChange={handleChange}
                />
              </span>
            </li>
            <li>
              Infants who arrive at the center asleep or fall asleep in other
              equipment, on the floor or elsewhere, will moved to a
              safety-approved crib for sleep.
            </li>
            <li>
              Swaddling will not be permitted, unless a physician's written
              statement authorizing it for a particular infant is provided. The
              written statement must include instructions and a time frame for
              swaddling the infant.
            </li>
            <li>
              Wedges, other infant positioning devices and monitors will not be
              permitted unless a physician's written statement authorizing its
              use for a particular infant is provided. The written statement
              must include instructions on how to use the device and a time
              frame for using it.
            </li>
          </ol>
          <p>
            I acknowledge that the director or designee has advised me of the
            safe sleep practices followed by the facility.
          </p>
          <div>
            <SignaturePadView signature={formData.signature} />
            <label>Date</label>
            <input
              type="date"
              name="signatureDate"
              value={formData.signatureDate}
              onChange={handleChange}
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
}

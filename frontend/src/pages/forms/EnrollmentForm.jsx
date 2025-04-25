import "../../styles/enrollmentForm.css";
import Signature from "../../components/Signature";

export default function EnrollmentForm() {
  return (
    <div className="enrollment_form">
      <form>
        <div className="flex spacer_lg">
          <label>Child’s Name:</label>
          <input type="text" className="flex_width" />
        </div>
        <div className="flex spacer_lg">
          <label>Date of Birth:</label>
          <input type="date" className="flex_width" />

          <label>Date Enrolled:</label>
          <input type="date" className="flex_width" />
        </div>
        <div className="checklist">
          <h5 className="text_align_center">GEMS Enrollment Application</h5>
          <h5 className="text_align_center">2025 Check List</h5>

          <h5 className="text_align_center">
            For all children, please fill out the following and return at least
            2 working days before the Start Date for your child.
          </h5>

          <div className="centered-list">
            <ul>
              <li className="custom-bullet">Emergency Medical Form</li>
              <li className="custom-bullet">Parental Agreement</li>
              <li className="custom-bullet">
                Allergy Statement (Allergies must be noted during enrollment)
              </li>
              <li className="custom-bullet">Emergency Contact List</li>
              <li className="custom-bullet">Authorized persons pickup list</li>
              <li className="custom-bullet">
                Copy of Guardians Identification
              </li>
              <li className="custom-bullet">All USDA forms</li>
              <li className="custom-bullet">Form 3231 and Form 3300</li>
              <li className="custom-bullet">
                Parent Handbook (emailed upon enrollment)
              </li>
            </ul>
          </div>

          <h5 className="text_align_center prek_text">
            GA PreK enrollment has additional requirements, please see the front
            desk for GA PreK enrollment paperwork.
          </h5>
        </div>
        <div className="date_comp_sign align_center input_spacer_med">
          <div>
            <label>Date Completed:</label>
            <input type="date" className="short_input" />
          </div>

          <div>
            <label>Parent Signature:</label>
            <input type="text" className="short_input" />
          </div>
        </div>
        <div className="flex align_center input_spacer_med">
          <label className="margin_right_small">
            Reviewed by Director/Admin:
          </label>
          <div className="director_review">
            <div className="flex column">
              <input type="text" />
              <label>Print Name</label>
            </div>

            <div className="flex column">
              <input type="text" />
              <label>Signature</label>
            </div>
          </div>
        </div>

        <div className="enrollemnt_app_container">
          <h5 className="spacer_lg">
            Enrollment Application (Please Print Clearly)
          </h5>
          <div className="flex input_spacer_med">
            <label>Entrance Date:</label>
            <input type="date" />

            <label>Withdrawal Date:</label>
            <input type="date" />
          </div>
          <div className="flex input_spacer_med">
            <label>Child's Name:</label>
            <input type="text" />
          </div>
          <div>
            <label>Gender:</label>
            <input type="text" style={{ width: "5rem" }} />

            <label>Male</label>
            <input type="text" style={{ width: "5rem" }} />

            <label>Female</label>
            <input type="text" style={{ width: "5rem" }} />

            <label>Age</label>
            <input type="text" style={{ width: "5rem" }} />

            <label>Date of Birth:</label>
            <input type="date" />
          </div>
          <div className="flex input_spacer_med">
            <label>Sponsor’s Name:</label>
            <input type="text" />
          </div>
          <div className="addressbar">
            <label>Address:</label>
            <div>
              <input type="text" />
              <label>Number Street</label>
            </div>
            <div>
              <input type="text" />
              <label>City</label>
            </div>
            <div>
              <input type="text" />
              <label>State</label>
            </div>
            <div>
              <input type="text" />
              <label>Zip Code</label>
            </div>
          </div>
          <div className="flex input_spacer_med">
            <label>Cell Phone:</label>
            <input type="text" />
            <label>Work Phone:</label>
            <input type="text" />
          </div>
          <div className="flex input_spacer_med">
            <label>Email address:</label>
            <input type="text" />
          </div>
          <div className="flex input_spacer_med">
            <label>Employer:</label>
            <input type="text" />
          </div>
          <div className="flex input_spacer_med">
            <label>Address:</label>
            <input type="text" />

            <label>Phone:</label>
            <input type="text" />
          </div>
          <div className="flex input_spacer_med">
            <label>Co Sponsor’s Name:</label>
            <input type="text" />
          </div>
          <div className="addressbar">
            <label>Address:</label>
            <div>
              <input type="text" />
              <label>Number Street</label>
            </div>
            <div>
              <input type="text" />
              <label>City</label>
            </div>
            <div>
              <input type="text" />
              <label>State</label>
            </div>
            <div>
              <input type="text" />
              <label>Zip Code</label>
            </div>
          </div>
          <div className="flex input_spacer_med">
            <label>Cell Phone:</label>
            <input type="text" />
            <label>Work Phone:</label>
            <input type="text" />
          </div>
          <div className="flex input_spacer_med">
            <label>Email address:</label>
            <input type="text" />
          </div>
          <div className="flex input_spacer_med">
            <p>Child’s Living Arrangements:</p>
            <label>
              <input
                type="radio"
                name="living_arrangement"
                value="both_parents"
              />{" "}
              Both Parents
            </label>
            <label>
              <input type="radio" name="living_arrangement" value="mother" />{" "}
              Mother
            </label>
            <label>
              <input type="radio" name="living_arrangement" value="father" />{" "}
              Father
            </label>
            <label>
              <input type="radio" name="living_arrangement" value="other" />{" "}
              Other
            </label>
          </div>
          <div className="flex input_spacer_med">
            <p>Child’s Legal Guardian:</p>
            <label>
              <input type="radio" name="legal_guardian" value="both_parents" />{" "}
              Both Parents
            </label>
            <label>
              <input type="radio" name="legal_guardian" value="mother" /> Mother
            </label>
            <label>
              <input type="radio" name="legal_guardian" value="father" /> Father
            </label>
            <label>
              <input type="radio" name="legal_guardian" value="other" /> Other
            </label>
          </div>
        </div>
        <div className="child_release_authorization">
          <h5>Authorization to Release Child</h5>
          <h5 className="underline">
            Parent Authorizes Gems Learning Academy to release their child to
            the following persons:
          </h5>
          <div className="flex input_spacer_med">
            <label>Name:</label>
            <input type="text" />
          </div>
          <div className="addressbar">
            <label>Address:</label>
            <div>
              <input type="text" />
              <label>Number Street</label>
            </div>
            <div>
              <input type="text" />
              <label>City</label>
            </div>
            <div>
              <input type="text" />
              <label>State</label>
            </div>
            <div>
              <input type="text" />
              <label>Zip Code</label>
            </div>
          </div>
          <div className="flex input_spacer_med">
            <label>Phone:</label>
            <input type="text" />

            <label>Alternate Phone:</label>
            <input type="text" />
          </div>
          <div className="flex input_spacer_med">
            <label>Relationship to Child/Parent</label>
            <input type="text" />
          </div>
          <div className="flex input_spacer_med">
            <label>Name:</label>
            <input type="text" />
          </div>
          <div className="addressbar">
            <label>Address:</label>
            <div>
              <input type="text" />
              <label>Number Street</label>
            </div>
            <div>
              <input type="text" />
              <label>City</label>
            </div>
            <div>
              <input type="text" />
              <label>State</label>
            </div>
            <div>
              <input type="text" />
              <label>Zip Code</label>
            </div>
          </div>
          <div className="flex input_spacer_med">
            <label>Phone:</label>
            <input type="text" />

            <label>Alternate Phone:</label>
            <input type="text" />
          </div>
          <div className="flex input_spacer_med">
            <label>Relationship to Child/Parent</label>
            <input type="text" />
          </div>
          <div className="flex input_spacer_med">
            <label>Name:</label>
            <input type="text" />
          </div>
          <div className="addressbar">
            <label>Address:</label>
            <div>
              <input type="text" />
              <label>Number Street</label>
            </div>
            <div>
              <input type="text" />
              <label>City</label>
            </div>
            <div>
              <input type="text" />
              <label>State</label>
            </div>
            <div>
              <input type="text" />
              <label>Zip Code</label>
            </div>
          </div>
          <div className="flex input_spacer_med">
            <label>Phone:</label>
            <input type="text" />

            <label>Alternate Phone:</label>
            <input type="text" />
          </div>
          <div className="flex input_spacer_med">
            <label>Relationship to Child/Parent</label>
            <input type="text" />
          </div>
        </div>
        <div className="emergency_contact">
          <h5 className="underline">
            In the case of an emergency who other than the parent may we
            contact:
          </h5>
          <div className="flex input_spacer_med">
            <label>Name:</label>
            <input type="text" />
          </div>
          <div className="addressbar">
            <label>Address:</label>
            <div>
              <input type="text" />
              <label>Number Street</label>
            </div>
            <div>
              <input type="text" />
              <label>City</label>
            </div>
            <div>
              <input type="text" />
              <label>State</label>
            </div>
            <div>
              <input type="text" />
              <label>Zip Code</label>
            </div>
          </div>
          <div className="flex input_spacer_med">
            <label>Phone:</label>
            <input type="text" />

            <label>Alternate Phone:</label>
            <input type="text" />
          </div>
          <div className="flex input_spacer_med">
            <label>Relationship to Child/Parent</label>
            <input type="text" />
          </div>
        </div>
        <div className="school_info">
          <h5 className="underline">
            My Child Attends the Following School (if Applicable)
          </h5>
          <div className="flex input_spacer_med">
            <label>Name of School</label>
            <input type="text" />
          </div>
          <div className="flex input_spacer_med">
            <label>Address:</label>
            <input type="text" />
          </div>
          <div className="flex input_spacer_med">
            <label>Phone:</label>
            <input type="text" />

            <label>Teacher's Name:</label>
            <input type="text" />
          </div>
        </div>

        <div className="parent_agreement">
          <h5>Parental Agreement</h5>
          <div>
            <h5>Medicine Administration </h5>
            <p>
              Before any medication is dispensed, I understand that I must
              provide a written authorization which includes the date to be
              administered, my child’s name, name of medication, prescription
              number, dosage and the time to be administered. All medicine will
              be in its original package. I further understand that the center
              does not administer inhalers unless the child’s doctor has a
              specified the amount to be inhaled and the time of the day to be
              administered.
            </p>
          </div>
          <div>
            <h5>Release from Center</h5>
            <p>
              I agree that my child will not be allowed to enter or leave the
              Center without being escorted by the parent(s); person(s);
              authorized by parent(s) or center personnel. Any person other than
              the parent or center staff must be stipulated in the child’s
              application.
            </p>
          </div>
          <div>
            <h5>Notification of Address and Important Information</h5>
            <p>
              I acknowledge that it is my responsibility to keep my child’s
              records current to reflect any significant changes at they may
              occur, telephone numbers, work location, emergency contacts,
              child’s physician, health status, feeding plans, immunization
              records, etc.
            </p>
          </div>
          <div>
            <h5>Incidents</h5>
            <p>
              I understand that it is Gem’s policy to keep me informed of any
              incidents, including illness, injuries, adverse reactions to
              medicines, and exposure to communicable diseases to which my child
              may be exposed. If the Center informs me that my child is ill, I
              understand that I must pick my child up within 40 minutes of being
              called.
            </p>
          </div>
          <div>
            <h5>Transportation</h5>
            <p>
              Gems will also obtain written authorization from me before my
              child participates in routine transportation, field trips, or
              special activities away from the Center including water related
              activities that are more than two feet deep.
            </p>
          </div>
          <div>
            <h5>Late pick up Policy</h5>
            <p>
              There is a $5.00 per minute per family late fee assessed for every
              minute the parent/guardian is late picking up his or her child.
              Hours of operation is 6:00am-6:30pm. The time assessed is
              according to Gem’s Learning Academy’s time clock.
            </p>
          </div>
          <div>
            <h5>Tuition and Fees</h5>
            <p>
              Tuition and fees are due on Monday of each week. If tuition is not
              paid by Monday evening at 6:30 pm, there will be a late fee of
              $20.00 charged and If payment is not made by Tuesday afternoon,
              then child/ren will not be able to attend on Wednesday. I agree to
              pay full tuition to reserve my child’s slot if he or she is absent
              for an entire week.
            </p>
          </div>
          <div>
            <h5>Return Check Policy</h5>
            <p>
              Bounced checks incur a $25.00 return check fee and your child will
              not be able to attend the center until payment is paid in full.
              Method of payment should be with a money order or pay with a
              credit card online.
            </p>
          </div>
          <div>
            <h5>School Closing Policy</h5>
            <p>
              Gem’s will be closed on the following days: New Year’s Day, Martin
              Luther King Day, Memorial Day, Independence Day, Labor Day,
              Juneteenth, Thanksgiving Day and the day after, Christmas Eve,
              Christmas Day, New Year’s Eve (Closes at 2:00 pm). Gems will close
              for inclement weather in accordance with Fulton County Schools.
            </p>
          </div>
          <div>
            <h5>Parent Handbook:</h5>
            <p>
              I have received and read the Parent Handbook for Gems Learning
              Academy. I understand the policies and procedures.
            </p>
          </div>
          <div>
            <label>Signature of Parent/Guardian</label>
            <input type="text" className="parent_agreement_signature" />
          </div>
          <div>
            <label>Date</label>
            <input type="date" className="parent_agreement_date" />
          </div>
        </div>

        <div className="emergency_medical_authroization">
          <h5>Emergency Medical Authorization</h5>
          <p>
            Should
            <input type="text" />, who was born on <input type="date" />, suffer
            an injury or illness while in the care of GEMS Learning Academy and
            the facility is unable to contact me immediately, it shall be
            authorized to secure such medical attention and care for the child
            as may be necessary. I (we) agree to keep the facility informed of
            changes in telephone numbers, etc., where I (we) can be reached.
          </p>

          <p>
            The facility agrees to keep me informed of any incidents requiring
            professional medical attention involving my child.
          </p>

          <div className="flex input_spacer_med">
            <label>Child’s Primary source of health care is:</label>
            <input type="text" />
          </div>

          <div className="flex space_btw">
            <div className="phy_and_tel_container flex column">
              <input type="text" />
              <label>Physician’s Name</label>
            </div>
            <div className="phy_and_tel_container flex column">
              <input type="text" />
              <label>Telephone Number</label>
            </div>
          </div>

          <div>
            <label>
              Known Medical Conditions (diabetic, asthmatic, drug allergies)
            </label>

            <div className="double_row_input">
              <div>
                <input type="text" />
                <input type="text" />
                <input type="text" />
              </div>

              <div>
                <input type="text" />
                <input type="text" />
                <input type="text" />
              </div>
            </div>
          </div>

          <div className="sign">
            <label>Signed:</label>
            <div className="flex column">
              <input type="text" />
              <label>Parent/Legal Guardian</label>
            </div>
          </div>

          <div>
            <label>Date:</label>
            <input type="date" />
          </div>

          <div class="phone-section">
            <label>Telephone Numbers:</label>
            <input type="text" />
            <label>Home</label>

            <div class="spacer"></div>
            <input type="text" />
            <label>Work</label>

            <div class="spacer"></div>
            <input type="text" />
            <label>Cell</label>
          </div>
        </div>

        <div className="doc_info">
          <h5>Child’s Physician or Health Care Provider</h5>

          <div>
            <label>Name of Doctor:</label>
            <input type="text" />
          </div>

          <div className="addressbar">
            <label>Address:</label>
            <div>
              <input type="text" />
              <label>Number Street</label>
            </div>
            <div>
              <input type="text" />
              <label>City</label>
            </div>
            <div>
              <input type="text" />
              <label>State</label>
            </div>
            <div>
              <input type="text" />
              <label>Zip Code</label>
            </div>
          </div>

          <div>
            <label>Phone:</label>
            <input type="text" />

            <label>Doctor’s Name:</label>
            <input type="text" />
          </div>

          <div>
            <label>
              The following special accommodations may be required to meet my
              child’s needs while at Gems’ Learning Academy:
            </label>
            <input type="text" />
          </div>

          <div>
            <label>Describe any allergies your child may have.</label>
            <input type="text" />
          </div>

          <div>
            <p>Does your child take any medication on a routine basis?</p>
            <label>
              <input type="radio" name="medication_routine" value="yes" /> Yes
            </label>
            <label>
              <input type="radio" name="medication_routine" value="no" /> No
            </label>
          </div>

          <div>
            <label>If yes, please explain and list any medications..</label>
            <input type="text" />
          </div>

          <div>
            <div>
              <label>If yes, please explain and list any medications..</label>
              <input type="text" />
            </div>

            <div>
              <label>If yes, please explain and list any medications..</label>
              <input type="text" />
            </div>
          </div>

          <p>
            GEMS Learning Academy does not discriminate of the basis of race,
            sex, age, disability, health, religion, or national origin. Children
            with persistent health or other challenges will be required to
            provide a physician’s statement that their condition is satisfactory
            for full participation in the program.
          </p>
        </div>

        <div className="transport_agreement">
          <h5>Transportation Agreement</h5>

          <div>
            <label>This is to certify that I give</label>
            <div className="underneath_label">
              <input value={"Gems Learning Academy"} type="text" />
              <label>Name of Facility</label>
            </div>
          </div>

          <div>
            <label>Permission to transport my child</label>
            <div className="underneath_label">
              <input type="text" />
              <label>Name of Child</label>
            </div>
          </div>

          <div>
            <label>From</label>
            <input type="text" />
            <label>at</label>
            <input type="text" />
            <label></label>

            <div>
              (
              <label>
                <input type="radio" name="medication_routine" value="am" /> AM
              </label>
              /
              <label>
                <input type="radio" name="medication_routine" value="pm" /> PM
              </label>
              )
            </div>
          </div>

          <div>
            <label>To</label>
            <input type="text" />
            <label>at</label>
            <input type="text" />
            <label></label>

            <div>
              (
              <label>
                <input type="radio" name="medication_routine" value="am" /> AM
              </label>
              /
              <label>
                <input type="radio" name="medication_routine" value="pm" /> PM
              </label>
              )
            </div>
          </div>

          <div>
            <label>My child will be transported from</label>
            <input type="text" />
            <label>at</label>
            <input type="text" />
            <label></label>

            <div>
              (
              <label>
                <input type="radio" name="medication_routine" value="am" /> AM
              </label>
              /
              <label>
                <input type="radio" name="medication_routine" value="pm" /> PM
              </label>
              )
            </div>
          </div>

          <div>
            <label>To</label>
            <input type="text" value={"Gems Learning Academy"} />
            <label>at</label>
            <input type="text" />
            <label></label>

            <div>
              (
              <label>
                <input type="radio" name="medication_routine" value="am" /> AM
              </label>
              /
              <label>
                <input type="radio" name="medication_routine" value="pm" /> PM
              </label>
              )
            </div>
          </div>

          <p>On the following days:</p>
          <div>
            <p>Select Days:</p>
            <label>
              <input type="checkbox" name="days" value="monday" /> Monday
            </label>
            <label>
              <input type="checkbox" name="days" value="tuesday" /> Tuesday
            </label>
            <label>
              <input type="checkbox" name="days" value="wednesday" /> Wednesday
            </label>
            <label>
              <input type="checkbox" name="days" value="thursday" /> Thursday
            </label>
            <label>
              <input type="checkbox" name="days" value="friday" /> Friday
            </label>
          </div>

          <div>
            <input type="text" />
            <label>
              is authorized to receive my child. In the event the authorized
            </label>
          </div>

          <div>
            <label>
              Person is not present to receive my child, the following
              procedures are to be followed:
            </label>

            <input type="text" />
          </div>

          <div>
            <label>The</label>
            <input type="text" />
            <label>is approximately</label>
            <input type="text" />
            <label>
              miles from the center. In the event my child is not to be
              transported as outlined above, I agree to notify Gem’s Learning
              Academy.
            </label>
          </div>

          <div>
            <div>
              <label>Signature (Parent/Guardian)</label>
              <input type="text" />
            </div>
            <div>
              <label>Date</label>
              <input type="date" />
            </div>
          </div>
        </div>

        <div className="vehicle_emergency">
          <h5>Vehicle Emergency Medical Information</h5>

          <div>
            <label>Child’s Name:</label>
            <input type="text" />
            <label>Date of Birth:</label>
            <input type="date" />
          </div>

          <div>
            <label>Address:</label>
            <input type="text" />
          </div>

          <div>
            <label>City:</label>
            <input type="text" />

            <label>State:</label>
            <input type="text" />

            <label>Zip Code:</label>
            <input type="text" />
          </div>

          <div>
            <label>Home Phone:</label>
            <input type="text" />

            <label>Work Phone:</label>
            <input type="text" />
          </div>
          <div>
            <label>Cell Phone:</label>
            <input type="text" />

            <label>Email Address:</label>
            <input type="text" />
          </div>
          <div>
            <label>Mother's Name:</label>
            <input type="text" />

            <label>Work Phone</label>
            <input type="text" />
          </div>
          <div>
            <label>Cell Phone:</label>
            <input type="text" />

            <label>Email Address:</label>
            <input type="text" />
          </div>
          <div>
            <label>Father's Name:</label>
            <input type="text" />

            <label>Work Phone:</label>
            <input type="text" />
          </div>
          <div>
            <label>Cell Phone:</label>
            <input type="text" />

            <label>Email Address:</label>
            <input type="text" />
          </div>
        </div>

        <div></div>

        <div className="emergency_non_parents">
          <h5>
            PERSON TO NOTIFY IN AN EMERGENCY IF PARENTS CANNOT BE REACHED:
          </h5>

          <div className="flex">
            <label>Name:</label>
            <input type="text" />

            <label>Phone Number:</label>
            <input type="text" />
          </div>

          <div className="flex">
            <label>Child's Doctor:</label>
            <input type="text" />

            <label>Phone Number:</label>
            <input type="text" />
          </div>

          <div>
            <label>Medical Facility used by Gem’s Learning Academy::</label>
            <h5>
              Southern Regional Medical Center, 11 Upper Riverdale Rd.
              Riverdale, Ga. 30274
            </h5>

            <div className="flex">
              <label>Child’s Allergies:</label>
              <input type="text" />
            </div>
            <div className="flex">
              <label>Current Prescribed Medication:</label>
              <input type="text" />
            </div>
            <div className="flex">
              <label>Child’s Special needs and conditions:</label>
              <input type="text" />
            </div>

            <p>
              In the event of an emergency and the center cannot get in touch
              with me, I hereby authorize any needed emergency medical care. I
              further agree to be fully responsible for all medical expenses
              incurred during the treatment of my child.
            </p>

            <div className="flex">
              <label>Child’s Name:</label>
              <input type="text" />
            </div>
            <div className="flex">
              <label>Signature (Parent/Guardian):</label>
              <input type="text" />
            </div>
            <div className="flex">
              <label>Witness By:</label>
              <input type="text" />
              <label>Date</label>
              <input type="date" />
            </div>
          </div>
        </div>

        <div className="allergy_statement">
          <h5>Allergy Statement</h5>

          <div className="flex">
            <label>Child’s Name:</label>
            <input type="text" />
          </div>

          <div className="flex">
            <label>Parent’s Name:</label>
            <input type="text" />
          </div>

          <div className="flex">
            <label>Nature of Allergy:</label>
            <input type="text" />
          </div>

          <div className="allergan_n_subs">
            <div>
              <label>Foods Child is Allergic to:</label>
              <input type="text" />
              <input type="text" />
              <input type="text" />
            </div>

            <div>
              <label>Substitute Foods:</label>
              <input type="text" />
              <input type="text" />
              <input type="text" />
            </div>
          </div>

          <div className="flex">
            <label>Health Care Practitioner:</label>
            <div className="flex column full_width">
              <input type="text" />
              <label>(Print Name)</label>
            </div>
            <div className="flex column full_width">
              <input type="text" />
              <label>(Title)</label>
            </div>
          </div>

          <div className="flex column" style={{ marginBlock: "2rem" }}>
            <input type="text" className="short_input" />
            <label>Signature of Healthcare Provider</label>
          </div>

          <div className="flex column" style={{ marginBlock: "2rem" }}>
            <input type="date" className="short_input" />
            <label>Date</label>
          </div>
        </div>
      </form>
    </div>
  );
}

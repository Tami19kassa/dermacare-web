import acneImage from '../assets/images/diseases/acne.jpg';
import eczemaImage from '../assets/images/diseases/eczema.jpg';
import psoriasisImage from '../assets/images/diseases/psoriasis.jpg';
import rosaceaImage from '../assets/images/diseases/rosacea.jpg';
import wartsImage from '../assets/images/diseases/warts.jpg';
import ringwormImage from '../assets/images/diseases/ringworm.jpg';
import coldSoresImage from '../assets/images/diseases/cold-sores.jpg';
import athletesFootImage from '../assets/images/diseases/athletes-foot.jpg';
import contactDermatitisImage from '../assets/images/diseases/contact-dermatitis.jpg';
import shinglesImage from '../assets/images/diseases/shingles.jpg';
import impetigoImage from '../assets/images/diseases/impetigo.jpg';
import seborrheicDermatitisImage from '../assets/images/diseases/seborrheic-dermatitis.jpg';
import vitiligoImage from '../assets/images/diseases/vitiligo.jpg';
import hivesImage from '../assets/images/diseases/hives.jpg';
import boilsImage from '../assets/images/diseases/boils.jpg';

export interface Disease {
  id: string;
  name: { en: string; am: string };
  image: string;  
  description: { en: string; am: string };
  symptoms: { en: string[]; am: string[] };
  homeTreatments: { en: string[]; am: string[] };
  doctorTreatments: { en: string[]; am: string[] };
  bestHabits: { en: string[]; am: string[] };
}
 
export const diseaseDatabase: Disease[] = [
  
  {
    id: "acne",
    name: { en: "Acne", am: "አክኔ" },
    image: acneImage,
    description: {
      en: "A common skin condition where hair follicles become clogged with oil and dead skin cells, causing pimples, blackheads, or cysts.",
      am: "አክኔ የቆዳ ቀዳዳዎች በዘይትና በሞቱ የቆዳ ህዋሶች ሲዘጉ የሚከሰት የተለመደ የቆዳ በሽታ ነው። ይህም ብጉር፣ ጥቁር ነጠብጣብ ወይም እጢ ያስከትላል።",
    },
    symptoms: {
      en: ["Pimples (small red bumps)", "Blackheads (open plugged pores)", "Whiteheads (closed plugged pores)", "Cysts (large, painful lumps)"],
      am: ["ብጉር (ትንንሽ ቀይ እብጠቶች)", "ጥቁር ነጠብጣቦች (የተከፈቱ የተዘጉ ቀዳዳዎች)", "ነጭ ነጠብጣቦች (የተዘጉ ቀዳዳዎች)", "እጢ (ከቆዳ በታች ያሉ ትልቅና አሳማሚ እብጠቶች)"],
    },
    homeTreatments: {
      en: ["Apply diluted tea tree oil (1:9 ratio)", "Use a honey and cinnamon mask", "Use a cold compress for inflammation"],
      am: ["የተቀጠነ የሻይ ዛፍ ዘይት (1:9) መጠቀም", "የማር እና ቀረፋ ማስክ መጠቀም", "ለማቃጠል ቀዝቃዛ ጭምቅ መጠቀም"],
    },
    doctorTreatments: {
      en: ["Topical retinoids", "Antibiotic creams or oral antibiotics", "Oral contraceptives for hormonal acne"],
      am: ["በቆዳ ላይ የሚቀቡ ሬቲኖይዶች", "አንቲባዮቲክ ክሬሞች ወይም የሚዋጡ አንቲባዮቲኮች", "ለሆርሞን ለተያያዘ ብጉር የእርግዝና መከላከያ ኪኒኖች"],
    },
    bestHabits: {
      en: ["Wash face twice daily with gentle cleanser", "Avoid touching your face", "Change pillowcases weekly", "Reduce use of oily cosmetics"],
      am: ["በቀን ሁለት ጊዜ ለስላሳ ማጽጃ ፊትን መታጠብ", "ፊትን ከመንካት መቆጠብ", "የትራስ ልብስን በየሳምንቱ መቀየር", "ቅባታማ መዋቢያዎችን መቀነስ"],
    },
  },
  // 2. Eczema (Atopic Dermatitis)
  {
    id: "eczema",
    name: { en: "Eczema (Atopic Dermatitis)", am: "ኤክማ (አቶፒክ የቆዳ በሽታ)" },
    image: eczemaImage,
    description: {
      en: "A condition that makes your skin red, dry, and itchy. It's chronic and tends to flare periodically, often alongside asthma or hay fever.",
      am: "ቆዳዎ ቀይ፣ ደረቅ እና የሚያሳክክ እንዲሆን የሚያደርግ ሁኔታ። ይህ ሥር የሰደደ ሲሆን ከአስም ወይም ከሣር ትኩሳት ጋር አብሮ በየጊዜው ይነሳል።",
    },
    symptoms: {
      en: ["Dry, scaly skin", "Red to brownish-gray patches", "Intense itching, especially at night", "Small, raised bumps which may leak fluid"],
      am: ["ደረቅና ቅርፊት ያለው ቆዳ", "ቀይ እስከ ቡናማ-ግራጫ ንጣፎች", "በተለይ በምሽት ከባድ ማሳከክ", "ፈሳሽ ሊያወጡ የሚችሉ ትንንሽ እብጠቶች"],
    },
    homeTreatments: {
      en: ["Moisturize skin at least twice a day", "Take warm baths with colloidal oatmeal", "Use a humidifier in dry weather"],
      am: ["ቆዳን በቀን ቢያንስ ሁለት ጊዜ ማርጠብ", "በሞቀ ውሃ እና ኦትሚል መታጠብ", "በደረቅ የአየር ጠባይ እርጥበት ማድረጊያ መጠቀም"],
    },
    doctorTreatments: {
      en: ["Prescription corticosteroid creams", "Oral medications like antihistamines", "Light therapy (phototherapy)"],
      am: ["በሐኪም የታዘዙ ኮርቲኮስትሮይድ ክሬሞች", "የአፍ ውስጥ መድሃኒቶች (አንቲሂስታሚኖች)", "የብርሃን ህክምና (ፎቶቴራፒ)"],
    },
    bestHabits: {
      en: ["Avoid harsh soaps and detergents", "Wear soft, breathable clothing", "Identify and avoid triggers", "Pat skin dry gently after bathing"],
      am: ["ጠንካራ ሳሙናዎችን ማስወገድ", "ለስላሳ፣ አየር የሚያስገባ ልብስ መልበስ", "ቀስቅሴዎችን መለየትና ማስወገድ", "ከታጠቡ በኋላ ቆዳን በቀስታ ማድረቅ"],
    },
  },
  // 3. Psoriasis
  {
    id: "psoriasis",
    name: { en: "Psoriasis", am: "ፕሶሪያሲስ" },
    image: psoriasisImage,
    description: {
      en: "A skin disease that causes a rash with itchy, scaly patches, most commonly on the knees, elbows, trunk and scalp.",
      am: "ቆዳ ላይ ማሳከክ እና ቅርፊት ያለው ሽፍታ የሚያስከትል የቆዳ በሽታ ሲሆን አብዛኛውን ጊዜ በጉልበት፣ በክርን፣ በሰውነትና በራስ ቅል ላይ ይከሰታል።",
    },
    symptoms: {
      en: ["Red patches of skin with thick, silvery scales", "Dry, cracked skin that may bleed or itch", "Itching, burning, or soreness", "Thickened or ridged nails"],
      am: ["በወፍራም፣ በብርማ ቅርፊቶች የተሸፈኑ ቀይ የቆዳ ንጣፎች", "ሊደማ ወይም ሊያሳክክ የሚችል ደረቅና የተሰነጠቀ ቆዳ", "ማሳከክ፣ ማቃጠል ወይም ህመም", "የወፈሩ ወይም የተሰነጣጠቁ ጥፍሮች"],
    },
    homeTreatments: {
      en: ["Use moisturizers with salicylic acid", "Take daily baths with Epsom salts", "Get small amounts of sunlight"],
      am: ["ሳሊሲሊክ አሲድ ያላቸውን እርጥበታማዎች መጠቀም", "በየቀኑ በኢፕሶም ጨው መታጠብ", "ትንሽ የጸሀይ ብርሃን ማግኘት"],
    },
    doctorTreatments: {
      en: ["Topical corticosteroids", "Light therapy", "Systemic medications (oral or injected)"],
      am: ["ቶፒካል ኮርቲኮስትሮይድስ", "የብርሃን ህክምና", "ሥርዓታዊ መድሃኒቶች (በአፍ ወይም በመርፌ)"],
    },
    bestHabits: {
      en: ["Keep skin moisturized", "Avoid skin injuries and infections", "Manage stress effectively", "Avoid smoking and limit alcohol"],
      am: ["ቆዳን እርጥበት ማድረግ", "የቆዳ ጉዳቶችን እና ኢንፌክሽኖችን ማስወገድ", "ውጥረትን በአግባቡ መቆጣጠር", "ማጨስን እና አልኮልን መቀነስ"],
    },
  },
  // 4. Rosacea
  {
    id: "rosacea",
    name: { en: "Rosacea", am: "ሮዜሽያ" },
    image:  rosaceaImage,
    description: {
        en: "A common skin condition that causes blushing or flushing and visible blood vessels in your face. It may also produce small, red, pus-filled bumps.",
        am: "ፊትዎ ላይ መቅላት ወይም መለብለብ እና የሚታዩ የደም ስሮችን የሚያስከትል የተለመደ የቆዳ በሽታ። በተጨማሪም ትናንሽ፣ ቀይ፣ እዥ የያዙ እብጠቶችን ሊያስከትል ይችላል።",
    },
    symptoms: {
        en: ["Facial blushing or flushing", "Visible spider veins (telangiectasia)", "Swollen red bumps, sometimes with pus", "Eye problems (dryness, irritation)"],
        am: ["የፊት መቅላት ወይም መለብለብ", "የሚታዩ የሸረሪት ደም ስሮች", "ያበጡ ቀይ እብጠቶች፣ አንዳንዴም እዥ ያላቸው", "የዓይን ችግሮች (ድርቀት፣ መቆጣት)"],
    },
    homeTreatments: {
        en: ["Identify and avoid triggers (sun, stress, alcohol)", "Use a gentle skincare routine", "Apply green tea compresses to reduce redness"],
        am: ["ቀስቅሴዎችን መለየትና ማስወገድ (ጸሀይ፣ ውጥረት፣ አልኮል)", "ለስላሳ የቆዳ እንክብካቤ ማድረግ", "የፊት መቅላትን ለመቀነስ የአረንጓዴ ሻይ ጭምቅ መጠቀም"],
    },
    doctorTreatments: {
        en: ["Topical creams (Metronidazole, Azelaic acid)", "Oral antibiotics (Doxycycline)", "Laser therapy to reduce redness"],
        am: ["በቆዳ ላይ የሚቀቡ ክሬሞች (ሜትሮንዳዞል፣ አዜላይክ አሲድ)", "የሚዋጡ አንቲባዮቲኮች (ዶክሲሳይክሊን)", "የፊት መቅላትን ለመቀነስ የሌዘር ህክምና"],
    },
    bestHabits: {
        en: ["Use sunscreen daily (SPF 30+)", "Choose gentle, non-abrasive skin products", "Protect your face in cold and windy weather", "Keep a diary to track flare-ups"],
        am: ["በየቀኑ የጸሀይ መከላከያ መጠቀም (SPF 30+)", "ለስላሳ፣ ቆዳ የማይፈጩ ምርቶችን መምረጥ", "በቀዝቃዛና ነፋሻማ የአየር ሁኔታ ፊትዎን መጠበቅ", "የበሽታውን መነሳት ለመከታተል ማስታወሻ ደብተር መያዝ"],
    },
  },
  // 5. Warts
  {
    id: "warts",
    name: { en: "Warts", am: "ኪንታሮት" },
    image: wartsImage,
    description: {
      en: "Small, fleshy bumps on the skin or mucous membranes caused by the human papillomavirus (HPV).",
      am: "በሰው ፓፒሎማቫይረስ (HPV) ምክንያት በቆዳ ወይም በስስ ሽፋን ላይ የሚወጡ ትናንሽ፣ ሥጋ-የለሽ እብጠቶች።",
    },
    symptoms: {
      en: ["Small, grainy skin growths", "Flesh-colored, white, pink or tan", "Rough to the touch", "May contain tiny black dots (clotted blood vessels)"],
      am: ["ትንንሽ፣ ቅንጣቢ የቆዳ እድገቶች", "የቆዳ ቀለም፣ ነጭ፣ ሮዝ ወይም ቡናማ ሊሆኑ ይችላሉ", "ሲነኩት ሻካራ የሆነ", "ጥቃቅን ጥቁር ነጥቦችን (የረጋ ደም ስሮች) ሊይዝ ይችላል"],
    },
    homeTreatments: {
      en: ["Over-the-counter salicylic acid treatments", "Duct tape occlusion (covering the wart)", "Apple cider vinegar soaks"],
      am: ["ያለሀኪም ትዕዛዝ የሚገኝ ሳሊሲሊክ አሲድ ህክምና", "በማጣበቂያ ቴፕ መሸፈን", "በአፕል ኮምጣጤ መዘፍዘፍ"],
    },
    doctorTreatments: {
      en: ["Cryotherapy (freezing with liquid nitrogen)", "Cantharidin application", "Minor surgery or laser treatment"],
      am: ["ክራዮቴራፒ (በፈሳሽ ናይትሮጅን ማቀዝቀዝ)", "ካንታሪዲን መቀባት", "ቀላል ቀዶ ጥገና ወይም የሌዘር ህክምና"],
    },
    bestHabits: {
      en: ["Avoid picking at warts", "Don't share towels, razors, or personal items", "Wear footwear in public showers and pools"],
      am: ["ኪንታሮትን ከመነካካት መቆጠብ", "ፎጣ፣ ምላጭ ወይም የግል ዕቃዎችን አለመጋራት", "በሕዝብ መታጠቢያና ገንዳ ቦታዎች ጫማ ማድረግ"],
    },
  },
  // 6. Ringworm (Tinea)
  {
    id: "ringworm",
    name: { en: "Ringworm (Tinea)", am: "ቋቁቻ (ቲኒያ)" },
    image: ringwormImage,
    description: {
      en: "A common fungal infection of the skin, not caused by a worm. It typically causes a circular, itchy, and scaly rash.",
      am: "በትል የማይከሰት የተለመደ የቆዳ ፈንገስ ኢንፌክሽን ነው። አብዛኛውን ጊዜ ክብ ቅርጽ ያለው፣ የሚያሳክክ እና ቅርፊታማ ሽፍታ ያስከትላል።",
    },
    symptoms: {
      en: ["A ring-shaped rash with slightly raised edges", "Itchy skin", "Clear or scaly area inside the ring", "Redness and inflammation"],
      am: ["የቀለበት ቅርጽ ያለው ሽፍታ ከፍ ባለ ጠርዝ", "የሚያሳክክ ቆዳ", "በቀለበቱ ውስጥ ንጹህ ወይም ቅርፊታማ ቦታ", "መቅላት እና ማቃጠል"],
    },
    homeTreatments: {
      en: ["Over-the-counter antifungal creams (clotrimazole, miconazole)", "Keep the affected area clean and dry", "Wash bedding and clothes frequently"],
      am: ["ያለሀኪም ትዕዛዝ የሚገኙ የፈንገስ መድኃኒት ክሬሞች (ክሎትሪማዞል፣ ሚኮናዞል)", "የተጎዳውን ቦታ ንጹህና ደረቅ ማድረግ", "የአልጋ ልብሶችንና ልብሶችን በተደጋጋሚ ማጠብ"],
    },
    doctorTreatments: {
      en: ["Prescription-strength antifungal creams or lotions", "Oral antifungal medications for severe or widespread cases"],
      am: ["በሀኪም ትዕዛዝ የሚሰጡ ጠንካራ የፈንገስ መድኃኒት ክሬሞች ወይም ሎሽኖች", "ለከባድ ወይም ለተስፋፋ በሽታ የሚዋጡ የፈንገስ መድኃኒቶች"],
    },
    bestHabits: {
      en: ["Don't share personal items like clothes or towels", "Dry your skin thoroughly after showering", "Wear loose-fitting clothing in breathable fabrics"],
      am: ["እንደ ልብስ ወይም ፎጣ ያሉ የግል ዕቃዎችን አለመጋራት", "ከሻወር በኋላ ቆዳዎን በደንብ ማድረቅ", "አየር የሚያስገቡ ሰፊ ልብሶችን መልበስ"],
    },
  },
  // 7. Cold Sores (Herpes Labialis)
  {
    id: "cold-sores",
    name: { en: "Cold Sores (Herpes Labialis)", am: "የከንፈር ቁስል (ሄርፕስ ላቢያሊስ)" },
    image: coldSoresImage,
    description: {
      en: "Small, painful blisters on or around the lips, mouth, or nose, caused by the herpes simplex virus (HSV-1).",
      am: "በሄርፕስ ስፕሌክስ ቫይረስ (HSV-1) ምክንያት በከንፈር፣ አፍ ወይም አፍንጫ ላይ ወይም ዙሪያ የሚወጡ ትናንሽና አሳማሚ አረፋዎች።",
    },
    symptoms: {
      en: ["Tingling, itching, or burning sensation before blisters appear", "Small, fluid-filled blisters", "Oozing and crusting over of the blisters", "Pain and swelling"],
      am: ["አረፋዎቹ ከመውጣታቸው በፊት የመቆጥቆጥ ወይም የማቃጠል ስሜት", "ትንንሽ ፈሳሽ የያዙ አረፋዎች", "የአረፋዎቹ ፈሳሽ ማውጣትና ቅርፊት መስራት", "ህመም እና እብጠት"],
    },
    homeTreatments: {
      en: ["Apply a cold, damp cloth to reduce redness and swelling", "Use over-the-counter creams containing docosanol or benzyl alcohol", "Apply aloe vera gel"],
      am: ["መቅላትንና እብጠትን ለመቀነስ ቀዝቃዛና እርጥብ ጨርቅ ማድረግ", "ዶኮሳኖል ወይም ቤንዚል አልኮል የያዙ ክሬሞችን መጠቀም", "የአልዎ ቬራ ጄል መቀባት"],
    },
    doctorTreatments: {
      en: ["Prescription oral antiviral medications (acyclovir, valacyclovir)", "Topical antiviral creams to speed up healing"],
      am: ["በሀኪም ትዕዛዝ የሚሰጡ የሚዋጡ የፀረ-ቫይረስ መድኃኒቶች (አሳይክሎቪር፣ ቫላሳይክሎቪር)", "ፈውስን ለማፋጠን በቆዳ ላይ የሚቀቡ የፀረ-ቫይረስ ክሬሞች"],
    },
    bestHabits: {
      en: ["Avoid skin-to-skin contact during an outbreak", "Wash hands frequently", "Use lip balm with sunscreen to prevent triggers", "Avoid sharing personal items"],
      am: ["በሽታው በሚነሳበት ጊዜ ከቆዳ ንክኪ መቆጠብ", "እጅን በተደጋጋሚ መታጠብ", "ቀስቃሽ ነገሮችን ለመከላከል የጸሀይ መከላከያ ያለው የከንፈር ቅባት መጠቀም", "የግል ዕቃዎችን ከመጋራት መቆጠብ"],
    },
  },
  // 8. Athlete's Foot (Tinea Pedis)
  {
    id: "athletes-foot",
    name: { en: "Athlete's Foot (Tinea Pedis)", am: "የእግር ፈንገስ (ቲኒያ ፔዲስ)" },
    image: athletesFootImage,
    description: {
      en: "A fungal infection that usually begins between the toes. It commonly occurs in people whose feet have become very sweaty while confined within tight-fitting shoes.",
      am: "አብዛኛውን ጊዜ በእግር ጣቶች መካከል የሚጀምር የፈንገስ ኢንፌክሽን ነው። ብዙውን ጊዜ እግሮቻቸው በጠባብ ጫማ ውስጥ ሆነው በጣም በሚያልባቸው ሰዎች ላይ ይከሰታል።",
    },
    symptoms: {
      en: ["Itchy, scaly rash between the toes", "Stinging or burning sensation", "Cracked and peeling skin", "Blisters and foot odor"],
      am: ["በእግር ጣቶች መካከል የሚያሳክክ፣ ቅርፊታማ ሽፍታ", "የመወጋጋት ወይም የማቃጠል ስሜት", "የተሰነጠቀና የሚላጥ ቆዳ", "አረፋዎች እና የእግር ሽታ"],
    },
    homeTreatments: {
      en: ["Use over-the-counter antifungal powders or sprays", "Soak feet in salt water or diluted vinegar", "Keep feet clean and dry"],
      am: ["ያለሀኪም ትዕዛዝ የሚገኙ የፈንገስ መድኃኒት ፓውደሮች ወይም ስፕሬዮች መጠቀም", "እግርን በጨው ውሃ ወይም በተቀጠነ ኮምጣጤ መዘፍዘፍ", "እግርን ንጹህና ደረቅ ማድረግ"],
    },
    doctorTreatments: {
      en: ["Prescription-strength topical antifungal medications", "Oral antifungal pills for persistent infections"],
      am: ["በሀኪም ትዕዛዝ የሚሰጡ ጠንካራ በቆዳ ላይ የሚቀቡ የፈንገስ መድኃኒቶች", "ለማይለቅ ኢንፌክሽን የሚዋጡ የፈንገስ መድኃኒት ኪኒኖች"],
    },
    bestHabits: {
      en: ["Change socks daily", "Wear moisture-wicking socks", "Alternate your shoes to let them dry", "Wear sandals in public showers"],
      am: ["በየቀኑ ካልሲ መቀየር", "እርጥበትን የሚመጡ ካልሲዎችን መልበስ", "ጫማዎችን እንዲደርቁ እየቀያየሩ መልበስ", "በሕዝብ መታጠቢያ ቦታዎች ጫማ ማድረግ"],
    },
  },
  // 9. Contact Dermatitis
  {
    id: "contact-dermatitis",
    name: { en: "Contact Dermatitis", am: "ንክኪ-ወለድ የቆዳ መቆጣት" },
    image: contactDermatitisImage,
    description: {
      en: "A red, itchy rash caused by direct contact with a substance or an allergic reaction to it. The rash isn't contagious or life-threatening, but it can be very uncomfortable.",
      am: "ከአንድ ንጥረ ነገር ጋር በቀጥታ በመገናኘት ወይም ለአለርጂ በመጋለጥ የሚከሰት ቀይ፣ የሚያሳክክ ሽፍታ። ሽፍታው ተላላፊ ወይም ለሕይወት አስጊ አይደለም፣ ነገር ግን በጣም ምቾት ሊነሳ ይችላል።",
    },
    symptoms: {
      en: ["Red rash or bumps", "Intense itching", "Dry, cracked, scaly skin", "Blisters and oozing in severe cases"],
      am: ["ቀይ ሽፍታ ወይም እብጠቶች", "ከባድ ማሳከክ", "ደረቅ፣ የተሰነጠቀ፣ ቅርፊታማ ቆዳ", "በከባድ ሁኔታዎች አረፋና ፈሳሽ ማውጣት"],
    },
    homeTreatments: {
      en: ["Identify and avoid the irritant or allergen", "Apply a cool, wet compress", "Use an anti-itch cream like hydrocortisone or calamine lotion"],
      am: ["የሚያበሳጨውን ወይም አለርጂ የሆነውን ነገር መለየትና ማስወገድ", "ቀዝቃዛ፣ እርጥብ ጭምቅ ማድረግ", "እንደ ሃይድሮኮርቲሶን ወይም ካላሚን ሎሽን ያሉ የማሳከክ መድኃኒት ክሬሞችን መጠቀም"],
    },
    doctorTreatments: {
      en: ["Prescription steroid creams", "Oral corticosteroids or antihistamines for severe reactions"],
      am: ["በሀኪም ትዕዛዝ የሚሰጡ የስቴሮይድ ክሬሞች", "ለከባድ ምላሾች የሚዋጡ ኮርቲኮስትሮይዶች ወይም አንቲሂስታሚኖች"],
    },
    bestHabits: {
      en: ["Wear protective clothing or gloves", "Apply a barrier cream or gel", "Wash your skin immediately after contact with a known irritant"],
      am: ["የመከላከያ ልብስ ወይም ጓንት መልበስ", "የመከላከያ ክሬም ወይም ጄል መቀባት", "ከሚያበሳጭ ነገር ጋር ከተገናኙ በኋላ ወዲያውኑ ቆዳዎን መታጠብ"],
    },
  },
  // 10. Shingles (Herpes Zoster)
  {
    id: "shingles",
    name: { en: "Shingles (Herpes Zoster)", am: "ሽንግልስ (የእሳት ራት)" },
    image: shinglesImage,
    description: {
      en: "A viral infection that causes a painful rash. It's caused by the varicella-zoster virus, the same virus that causes chickenpox.",
      am: "አሳማሚ ሽፍታ የሚያስከትል የቫይረስ ኢንፌክሽን። በቫሪሴላ-ዞስተር ቫይረስ የሚከሰት ሲሆን ይህም ኩፍኝን የሚያስከትለው ቫይረስ ነው።",
    },
    symptoms: {
      en: ["Pain, burning, numbness or tingling, usually on one side of the body", "A red rash that begins a few days after the pain", "Fluid-filled blisters that break open and crust over", "Fever, headache, and fatigue"],
      am: ["ህመም፣ ማቃጠል፣ መደንዘዝ ወይም መቆጥቆጥ፣ አብዛኛውን ጊዜ በአንድ የሰውነት ክፍል ላይ", "ከህመሙ ከጥቂት ቀናት በኋላ የሚጀምር ቀይ ሽፍታ", "ፈሳሽ የያዙ አረፋዎች ተከፍተው ቅርፊት የሚሰሩ", "ትኩሳት፣ ራስ ምታት እና ድካም"],
    },
    homeTreatments: {
      en: ["Take cool baths or use cool, wet compresses", "Apply calamine lotion", "Eat a well-balanced diet to boost immunity"],
      am: ["ቀዝቃዛ ገላ መታጠብ ወይም ቀዝቃዛ፣ እርጥብ ጭምቆችን መጠቀም", "ካላሚን ሎሽን መቀባት", "የበሽታ መከላከያ አቅምን ለመጨመር የተመጣጠነ ምግብ መመገብ"],
    },
    doctorTreatments: {
      en: ["Antiviral drugs (acyclovir, valacyclovir) started early", "Pain relievers, including nerve pain medications", "Shingles vaccine for prevention"],
      am: ["በጊዜ የተጀመሩ የፀረ-ቫይረስ መድኃኒቶች (አሳይክሎቪር፣ ቫላሳይክሎቪር)", "የነርቭ ህመም መድኃኒቶችን ጨምሮ የህመም ማስታገሻዎች", "ለመከላከል የሽንግልስ ክትባት"],
    },
    bestHabits: {
      en: ["Get adequate rest", "Manage stress", "Avoid contact with people who haven't had chickenpox", "Keep the rash clean and covered"],
      am: ["በቂ እረፍት ማድረግ", "ውጥረትን መቆጣጠር", "ኩፍኝ ካልያዛቸው ሰዎች ጋር ንክኪን ማስወገድ", "ሽፍታውን ንጹህና የተሸፈነ ማድረግ"],
    },
  },
  // 11. Impetigo
  {
    id: "impetigo",
    name: { en: "Impetigo", am: "ኢምፔቲጎ (የቆዳ መግል)" },
    image: impetigoImage,
    description: {
      en: "A common and highly contagious skin infection that mainly affects infants and children. It usually appears as red sores on the face, especially around a child's nose and mouth.",
      am: "በዋነኛነት ጨቅላ ሕፃናትንና ልጆችን የሚያጠቃ የተለመደና በጣም ተላላፊ የቆዳ ኢንፌክሽን ነው። አብዛኛውን ጊዜ በፊት ላይ፣ በተለይም በልጅ አፍንጫና አፍ ዙሪያ እንደ ቀይ ቁስሎች ይታያል።",
    },
    symptoms: {
      en: ["Red sores that quickly rupture, ooze for a few days, and then form a yellowish-brown crust", "Itching and soreness", "Painless, fluid-filled blisters (bullous impetigo)"],
      am: ["በፍጥነት የሚፈነዱ፣ ለጥቂት ቀናት ፈሳሽ የሚያወጡ እና ከዚያም ቢጫ-ቡናማ ቅርፊት የሚሰሩ ቀይ ቁስሎች", "ማሳከክ እና ህመም", "ህመም የሌላቸው፣ ፈሳሽ የያዙ አረፋዎች (ቡለስ ኢምፔቲጎ)"],
    },
    homeTreatments: {
      en: ["Gently wash the affected areas with mild soap and water", "Soak the sores in warm water to help remove crusts", "Cover affected areas to prevent spreading"],
      am: ["የተጎዱትን ቦታዎች በቀስታ በለስላሳ ሳሙናና ውሃ ማጠብ", "ቅርፊቱን ለማስወገድ ቁስሎቹን በሞቀ ውሃ መዘፍዘፍ", "መስፋፋትን ለመከላከል የተጎዱትን ቦታዎች መሸፈን"],
    },
    doctorTreatments: {
      en: ["Topical antibiotic ointment (mupirocin)", "Oral antibiotics for more severe or widespread infections"],
      am: ["በቆዳ ላይ የሚቀባ አንቲባዮቲክ ቅባት (ሙፒሮሲን)", "ለከፋ ወይም ለተስፋፋ ኢንፌክሽን የሚዋጡ አንቲባዮቲኮች"],
    },
    bestHabits: {
      en: ["Wash hands thoroughly and often", "Keep fingernails short", "Do not share towels, clothing, or bedding", "Keep children home from school until no longer contagious"],
      am: ["እጅን በደንብና በተደጋጋሚ መታጠብ", "ጥፍርን አጭር ማድረግ", "ፎጣ፣ ልብስ ወይም የአልጋ ልብስ አለመጋራት", "ተላላፊነቱ እስኪያልፍ ድረስ ልጆችን ከትምህርት ቤት ቤት ማስቀረት"],
    },
  },
  // 12. Seborrheic Dermatitis
  {
    id: "seborrheic-dermatitis",
    name: { en: "Seborrheic Dermatitis", am: "ሰቦሪይክ የቆዳ በሽታ" },
    image: seborrheicDermatitisImage,
    description: {
      en: "A common skin condition that mainly affects your scalp, causing scaly patches, red skin, and stubborn dandruff. It can also affect oily areas of the body.",
      am: "በዋነኛነት የራስ ቆዳን የሚያጠቃ የተለመደ የቆዳ በሽታ ሲሆን ቅርፊታማ ንጣፎችን፣ ቀይ ቆዳን እና የማይለቅ ፎረፎርን ያስከትላል። እንዲሁም ቅባታማ የሰውነት ክፍሎችን ሊጎዳ ይችላል።",
    },
    symptoms: {
      en: ["Skin flakes (dandruff) on scalp, hair, eyebrows, beard or mustache", "Patches of greasy skin covered with flaky white or yellow scales", "Red skin and itching"],
      am: ["በራስ ቆዳ፣ ጸጉር፣ ቅንድብ፣ ጺም ላይ የቆዳ ቅርፊቶች (ፎረፎር)", "በነጭ ወይም ቢጫ ቅርፊቶች የተሸፈኑ ቅባታማ የቆዳ ንጣፎች", "ቀይ ቆዳ እና ማሳከክ"],
    },
    homeTreatments: {
      en: ["Use over-the-counter dandruff shampoos (containing selenium sulfide, ketoconazole, or salicylic acid)", "Apply aloe vera or tea tree oil", "Avoid harsh soaps"],
      am: ["ያለሀኪም ትዕዛዝ የሚገኙ የፎረፎር ሻምፖዎችን መጠቀም (ሴሊኒየም ሰልፋይድ፣ ኬቶኮናዞል ወይም ሳሊሲሊክ አሲድ የያዙ)", "አልዎ ቬራ ወይም የሻይ ዛፍ ዘይት መቀባት", "ጠንካራ ሳሙናዎችን ማስወገድ"],
    },
    doctorTreatments: {
      en: ["Prescription-strength shampoos, creams, or ointments", "Antifungal pills", "Corticosteroid lotions"],
      am: ["በሀኪም ትዕዛዝ የሚሰጡ ጠንካራ ሻምፖዎች፣ ክሬሞች ወይም ቅባቶች", "የፈንገስ መድኃኒት ኪኒኖች", "የኮርቲኮስትሮይድ ሎሽኖች"],
    },
    bestHabits: {
      en: ["Shampoo regularly", "Manage stress", "Avoid products with alcohol", "Get a moderate amount of sun exposure"],
      am: ["በየጊዜው ጸጉርን በሻምፖ መታጠብ", "ውጥረትን መቆጣጠር", "አልኮል የያዙ ምርቶችን ማስወገድ", "መጠነኛ የጸሀይ ብርሃን ማግኘት"],
    },
  },
  // 13. Vitiligo
  {
    id: "vitiligo",
    name: { en: "Vitiligo", am: "ለምጽ (ቪቲሊጎ)" },
    image: vitiligoImage,
    description: {
      en: "A disease that causes the loss of skin color in patches. The discolored areas usually get bigger with time. The condition can affect the skin on any part of the body.",
      am: "በንጣፍ መልክ የቆዳ ቀለም መጥፋትን የሚያስከትል በሽታ። ቀለም የጠፋባቸው ቦታዎች ከጊዜ ጋር እየሰፉ ይሄዳሉ። ይህ ሁኔታ በማንኛውም የሰውነት ክፍል ላይ ያለውን ቆዳ ሊጎዳ ይችላል።",
    },
    symptoms: {
      en: ["Patchy loss of skin color", "Premature whitening or graying of the hair on your scalp, eyelashes, eyebrows or beard", "Loss of color in the tissues that line the inside of your mouth and nose"],
      am: ["በንጣፍ መልክ የቆዳ ቀለም መጥፋት", "የራስ ቆዳ፣ ሽፋሽፍት፣ ቅንድብ ወይም ጺም ጸጉር ያለጊዜው መሸበት", "የአፍና የአፍንጫ ውስጠኛ ክፍል ቀለም ማጣት"],
    },
    homeTreatments: {
      en: ["Use sunscreen to protect affected skin from the sun", "Use cosmetic camouflage or self-tanning lotion to even skin tone", "Manage stress"],
      am: ["የተጎዳውን ቆዳ ከጸሀይ ለመጠበቅ የጸሀይ መከላከያ መጠቀም", "የቆዳ ቀለምን ለማስተካከል የመዋቢያ መሸፈኛ ወይም ራስን የሚያጠቁር ሎሽን መጠቀም", "ውጥረትን መቆጣጠር"],
    },
    doctorTreatments: {
      en: ["Topical corticosteroids or calcineurin inhibitors", "Light therapy (phototherapy)", "Depigmentation of remaining skin", "Skin grafting surgery"],
      am: ["በቆዳ ላይ የሚቀቡ ኮርቲኮስትሮይዶች ወይም ካልሲኒዩሪን ኢንሂቢተሮች", "የብርሃን ህክምና (ፎቶቴራፒ)", "የቀረውን ቆዳ ቀለም ማስወገድ", "የቆዳ ንቅለ ተከላ ቀዶ ጥገና"],
    },
    bestHabits: {
      en: ["Protect your skin from the sun", "Avoid skin trauma or injury", "Be cautious with chemicals", "Join a support group"],
      am: ["ቆዳዎን ከጸሀይ መጠበቅ", "የቆዳ ጉዳትን ማስወገድ", "ከኬሚካሎች ጋር ጥንቃቄ ማድረግ", "የድጋፍ ቡድንን መቀላቀል"],
    },
  },
  // 14. Hives (Urticaria)
  {
    id: "hives",
    name: { en: "Hives (Urticaria)", am: "ቀፎ (አርቲካሪያ)" },
    image: hivesImage,
    description: {
      en: "A skin rash triggered by a reaction to food, medicine, or other irritants. Hives are raised, often itchy, red welts on the surface of the skin.",
      am: "በምግብ፣ በመድኃኒት ወይም በሌሎች የሚያበሳጩ ነገሮች ምክንያት የሚቀሰቀስ የቆዳ ሽፍታ። ቀፎዎች ከቆዳ ላይ ከፍ ያሉ፣ ብዙ ጊዜ የሚያሳክኩ፣ ቀይ እብጠቶች ናቸው።",
    },
    symptoms: {
      en: ["Batches of raised, red or skin-colored welts (wheals)", "Intense itching", "Swelling around the eyes, lips or throat (angioedema)", "Welts that appear and fade repeatedly"],
      am: ["ከፍ ያሉ፣ ቀይ ወይም የቆዳ ቀለም ያላቸው እብጠቶች (ሽፍታዎች)", "ከባድ ማሳከክ", "በዓይን፣ በከንፈር ወይም በጉሮሮ ዙሪያ ማበጥ (አንጂዮኤዴማ)", "የሚታዩና የሚጠፉ እብጠቶች"],
    },
    homeTreatments: {
      en: ["Take a cool bath or shower", "Apply a cool compress", "Wear loose, smooth-textured cotton clothing", "Avoid known triggers"],
      am: ["ቀዝቃዛ ገላ መታጠብ", "ቀዝቃዛ ጭምቅ ማድረግ", "ሰፊ፣ ለስላሳ የጥጥ ልብሶችን መልበስ", "የሚያስነሱ ነገሮችን ማስወገድ"],
    },
    doctorTreatments: {
      en: ["Non-drowsy antihistamines (loratadine, cetirizine)", "Oral corticosteroids for severe cases", "Epinephrine injection for severe allergic reactions"],
      am: ["የማያስ drowsy አንቲሂስታሚኖች (ሎራታዲን፣ ሴትሪዚን)", "ለከባድ ሁኔታዎች የሚዋጡ ኮርቲኮስትሮይዶች", "ለከባድ የአለርጂ ምላሾች የኢፒንፍሪን መርፌ"],
    },
    bestHabits: {
      en: ["Keep a diary to identify triggers", "Avoid harsh soaps", "Soothe the affected area with baths and cool compresses", "Manage stress"],
      am: ["ቀስቅሴዎችን ለመለየት ማስታወሻ ደብተር መያዝ", "ጠንካራ ሳሙናዎችን ማስወገድ", "የተጎዳውን ቦታ በገላ መታጠብና በቀዝቃዛ ጭምቅ ማስታገስ", "ውጥረትን መቆጣጠር"],
    },
  },
  // 15. Boils (Furuncles)
  {
    id: "boils",
    name: { en: "Boils (Furuncles)", am: "እባጭ (ፉሩንክል)" },
    image: boilsImage,
    description: {
      en: "A painful, pus-filled bump that forms under your skin when bacteria infect and inflame one or more of your hair follicles. A cluster of boils is called a carbuncle.",
      am: "ባክቴሪያ አንድ ወይም ከዚያ በላይ የጸጉር ቀዳዳዎችን ሲበክልና ሲያቃጥል ከቆዳዎ በታች የሚፈጠር አሳማሚ፣ መግል የያዘ እብጠት። የእባጮች ስብስብ ካርበንክል ይባላል።",
    },
    symptoms: {
      en: ["A painful, red bump that starts small and can grow larger", "Red, swollen skin around the bump", "Development of a yellow-white tip that may rupture and drain pus", "Fever or chills in severe cases"],
      am: ["ትንሽ ሆኖ የሚጀምር እና ሊያድግ የሚችል አሳማሚ፣ ቀይ እብጠት", "በእብጠቱ ዙሪያ ቀይ፣ ያበጠ ቆዳ", "ሊፈነዳና መግል ሊያወጣ የሚችል ቢጫ-ነጭ ጫፍ መፈጠር", "በከባድ ሁኔታዎች ትኩሳት ወይም ብርድ ብርድ ማለት"],
    },
    homeTreatments: {
      en: ["Apply a warm, wet compress several times a day to help it rupture and drain", "Never squeeze or lance a boil yourself", "Wash the area thoroughly after it drains"],
      am: ["እንዲፈነዳና እንዲፈስ ለመርዳት በቀን ብዙ ጊዜ ሞቃት፣ እርጥብ ጭምቅ ማድረግ", "እባጭን በራስዎ በጭራሽ አይጨምቁ ወይም አይቅደዱ", "ከፈሰሰ በኋላ ቦታውን በደንብ ማጠብ"],
    },
    doctorTreatments: {
      en: ["Lancing (incision and drainage) by a doctor to drain the pus", "Antibiotic medication if the infection is severe or recurrent"],
      am: ["መግሉን ለማውጣት በሐኪም መቅደድ (መቁረጥና ማፍሰስ)", "ኢንፌክሽኑ ከባድ ወይም ተደጋጋሚ ከሆነ የአንቲባዮቲክ መድኃኒት"],
    },
    bestHabits: {
      en: ["Practice good personal hygiene", "Avoid sharing personal items like towels and razors", "Clean and cover any minor skin wounds", "Maintain a healthy immune system"],
      am: ["ጥሩ የግል ንጽህናን መጠበቅ", "እንደ ፎጣና ምላጭ ያሉ የግል ዕቃዎችን ከመጋራት መቆጠብ", "ማንኛውንም ጥቃቅን የቆዳ ቁስሎች ማጽዳትና መሸፈን", "ጤናማ የበሽታ መከላከያ ሥርዓት መያዝ"],
    },
  },
];

/**
 * A helper function to easily find and return a disease object by its unique ID.
 * @param id The ID of the disease to find (e.g., "acne").
 * @returns The complete disease object, or undefined if not found.
 */
export const getDiseaseById = (id: string | null): Disease | undefined => {
  if (!id) return undefined;
  return diseaseDatabase.find(disease => disease.id === id);
};
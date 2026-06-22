// ─── ExamNinja Question Bank ──────────────────────────────────────────────────
// All passage sets. To add more, append to this array.
// Each set: { id, section, topic, difficulty, timeLimit, source, passage, principle, questions[] }
// Each question: { question, options[4], correct (0-indexed), explanation }

const questionBank = [

  // ── S1: Legal Reasoning · Constitutional Law – Article 21 ────────────────
  {
    id: 'S1', section: 'Legal Reasoning', topic: 'Constitutional Law – Article 21',
    difficulty: 'hard', timeLimit: 120, source: 'Original',
    passage: "The Supreme Court of India, in Maneka Gandhi v. Union of India (1978), dramatically expanded the scope of Article 21 of the Indian Constitution. Article 21 states that no person shall be deprived of their life or personal liberty except according to 'procedure established by law.' Prior to 1978, the Court had interpreted this narrowly — any procedure enacted by a legislature, however arbitrary, would satisfy Article 21. The Maneka Gandhi judgment changed this: the Court held that the procedure must be 'fair, just and reasonable,' not arbitrary or oppressive. The Court also held that Articles 14 (equality before law), 19 (freedom of speech, movement, etc.) and 21 together form a 'golden triangle' — a law interfering with personal liberty must satisfy all three simultaneously. Over the decades, the courts have read dozens of rights into Article 21, including the right to education, the right to health, the right to a clean environment, and the right to a speedy trial.",
    principle: null,
    questions: [
      {
        question: "What was the Court's interpretation of Article 21 before the Maneka Gandhi judgment?",
        options: [
          'Any procedure enacted by a legislature — however arbitrary — would satisfy Article 21',
          'The procedure must be fair, just and reasonable',
          'Personal liberty could never be restricted by the State',
          'Only Parliament, not state legislatures, could restrict personal liberty'
        ],
        correct: 0,
        explanation: "Before Maneka Gandhi, the Court held in A.K. Gopalan (1950) that any legislatively enacted procedure satisfied Article 21, regardless of whether it was fair or reasonable. The standard was purely formal — if the legislature passed it, it was valid."
      },
      {
        question: "What is the 'golden triangle' referred to in the passage?",
        options: [
          'Articles 14, 19, and 21 of the Constitution',
          'The three levels of courts — District Court, High Court and Supreme Court',
          'The three fundamental duties enshrined in Article 51A',
          'Articles 32, 136 and 226 — the writ jurisdiction provisions'
        ],
        correct: 0,
        explanation: "The passage explicitly states that Articles 14, 19 and 21 form a 'golden triangle' — any law restricting personal liberty must satisfy all three simultaneously. This is a frequently tested CLAT concept."
      },
      {
        question: 'Which of the following rights is NOT mentioned in the passage as having been read into Article 21?',
        options: [
          'Right to education',
          'Right to a speedy trial',
          'Right to privacy',
          'Right to a clean environment'
        ],
        correct: 2,
        explanation: "The passage lists right to education, right to health, right to a clean environment, and right to a speedy trial. The right to privacy — though recognised in K.S. Puttaswamy (2017) — is not mentioned here. Always answer strictly from the passage in CLAT."
      },
      {
        question: "A state legislature passes a law allowing police to detain any person for 30 days without any hearing if 'deemed necessary for public order.' A citizen challenges this law. Based on the post-Maneka Gandhi framework, what is the most likely outcome?",
        options: [
          'The law is valid — the legislature enacted it so the procedure is satisfied',
          'The law would be struck down as it fails the fairness test under Article 21 and likely violates Article 14 as well',
          'The law is valid as public order concerns override Article 21 protections',
          "The court would defer entirely to the legislature's judgment on public order matters"
        ],
        correct: 1,
        explanation: "Post-Maneka Gandhi, any procedure restricting personal liberty must be fair, just and reasonable. A 30-day detention without any hearing is arbitrary and oppressive — it fails the golden triangle test. Option A reflects the pre-1978 position which no longer applies."
      }
    ]
  },

  // ── S2: Legal Reasoning · Tort Law – Trespass to Land ───────────────────
  {
    id: 'S2', section: 'Legal Reasoning', topic: 'Tort Law – Trespass to Land',
    difficulty: 'medium', timeLimit: 90, source: 'Original',
    passage: "Trespass to land occurs when a person intentionally enters another's land without consent or legal authority. The tort is actionable per se — meaning the claimant need not prove actual damage; the mere entry is sufficient. However, trespass requires a positive act by the defendant: being passively placed on another's land against one's will does not constitute trespass. The courts recognise necessity as a defence — a person may enter another's land without consent if doing so is reasonably necessary to prevent imminent harm, provided the interference is proportionate to the threat. The owner of the land retains the right to use reasonable force to eject a trespasser, but such force must not exceed what is strictly necessary.",
    principle: null,
    questions: [
      {
        question: "Priya deliberately walks through Vikram's garden as a shortcut without realising it is private property. Vikram sues for trespass. Will Vikram succeed?",
        options: [
          'No — Priya did not know it was private property so she lacked the intent required for trespass',
          'Yes — trespass requires that the entry be a deliberate act, not that the person knew they were trespassing',
          'No — Vikram must first prove that his garden was damaged',
          'Yes — but only if Vikram had erected a visible boundary or a No Trespassing sign'
        ],
        correct: 1,
        explanation: "Trespass requires an intentional entry — meaning the physical act must be deliberate. Priya chose to walk through the garden; it does not matter that she was unaware it was private property. Option C is wrong because trespass is actionable per se — no damage needs to be proved."
      },
      {
        question: "A forest fire breaks out near Asha's farm. Her neighbour Dev cuts through Asha's fence and enters her land to build a firebreak preventing the fire from reaching both properties. Asha later sues Dev for trespass. What is Dev's strongest defence?",
        options: [
          'He was a neighbour so he had an implied licence to enter her land',
          'Necessity — his entry was reasonably necessary to prevent imminent harm and the interference was proportionate to the threat',
          'He cannot be sued as his actions ultimately benefited Asha',
          'Asha suffered no damage and trespass requires proof of damage'
        ],
        correct: 1,
        explanation: "The passage recognises necessity as a defence when entry is reasonably necessary to prevent imminent harm and the interference is proportionate. Dev's entry was to prevent a fire — a serious imminent harm — and building a firebreak is proportionate to that threat."
      },
      {
        question: "Suresh discovers Raj camping on his land without permission. Suresh physically removes Raj using considerable force, injuring him in the process. Raj sues Suresh. Based on the passage, what is the most accurate assessment?",
        options: [
          'Suresh was fully within his rights — a landowner may use any level of force to remove a trespasser',
          'Suresh may be liable — he is entitled to use reasonable force to eject a trespasser but the force must not exceed what is strictly necessary',
          'Raj cannot sue as he was the original wrongdoer',
          'Suresh is liable only if a court determines the injury was permanent'
        ],
        correct: 1,
        explanation: "The passage states the owner may use 'reasonable force' but it 'must not exceed what is strictly necessary.' Suresh used considerable force causing injury — this likely exceeds what was strictly necessary and exposes him to liability for the excess."
      }
    ]
  },

  // ── S3: English Language · Critical Reading – Climate Policy ────────────
  {
    id: 'S3', section: 'English Language', topic: 'Critical Reading – Climate Policy',
    difficulty: 'easy', timeLimit: 60, source: 'Original',
    passage: "The debate around climate policy has shifted significantly in recent years from a question of scientific consensus to one of economic and political will. There is now near-universal agreement among climate scientists that human activity — particularly the burning of fossil fuels — is the dominant cause of the rapid warming observed since the Industrial Revolution. Yet global emissions continue to rise. Critics of aggressive climate action argue that the economic costs of rapid decarbonisation — job losses in coal and petroleum sectors, higher energy prices for consumers, reduced industrial competitiveness — are too high a price for developing nations still seeking to lift millions out of poverty. Proponents counter that the long-term economic costs of inaction — including sea-level rise, extreme weather events, agricultural disruption and mass migration — will far outweigh any short-term transition costs. They also point to the growing competitiveness of renewable energy, arguing that the economic case for transition has never been stronger. A key tension remains: the countries that have historically contributed most to cumulative emissions are not the same as those that will suffer most from the consequences.",
    principle: null,
    questions: [
      {
        question: "What does the passage identify as the primary reason why global emissions continue to rise despite scientific consensus?",
        options: [
          'Scientists are still debating the fundamental causes of climate change',
          'Renewable energy is not yet economically competitive with fossil fuels',
          'The issue has moved from scientific debate to one of economic and political will',
          'Developing nations are unwilling to participate in international climate agreements'
        ],
        correct: 2,
        explanation: "The passage explicitly states the shift is 'from a question of scientific consensus to one of economic and political will.' The science is settled; the barrier is now political and economic. Option B is actually contradicted — the passage says renewable competitiveness has improved."
      },
      {
        question: "The passage suggests critics of aggressive climate policy are primarily concerned with:",
        options: [
          'The scientific validity of long-term climate projections',
          'The economic burden on developing nations and workers in fossil fuel industries',
          'The technical feasibility of deploying renewable energy at scale',
          'The pace at which governments can retrain displaced coal workers'
        ],
        correct: 1,
        explanation: "The critics' argument lists job losses, higher energy prices, and reduced competitiveness — all economic concerns, particularly for developing nations still addressing poverty. The passage gives no indication they doubt the science."
      },
      {
        question: "Which of the following best describes the 'key tension' identified in the final sentence of the passage?",
        options: [
          'The conflict between scientists and economists over the reliability of climate models',
          'A mismatch between the nations most responsible for historical emissions and those most vulnerable to future consequences',
          'The difficulty of transitioning energy infrastructure within a politically acceptable timeframe',
          'Disagreement between developed and developing nations over how to measure cumulative emissions'
        ],
        correct: 1,
        explanation: "The passage directly states that the countries contributing most to cumulative emissions are not the same as those that will suffer most. This equity mismatch — responsibility vs. consequence — is the 'key tension.' Don't confuse this with general north-south disagreement."
      },
      {
        question: "Which of the following, if true, would most STRENGTHEN the proponents' argument as described in the passage?",
        options: [
          'A new study shows solar energy is now cheaper than coal in over 130 countries, making the economic case for transition compelling',
          'Research finds that job losses in coal have been partially offset by growth in natural gas extraction',
          'A UN report projects that sea-level rise will be 15% less severe than previously estimated',
          'Developing nations have requested a 10-year extension before committing to binding emissions targets'
        ],
        correct: 0,
        explanation: "Proponents argue the economic case for transition 'has never been stronger' due to renewable competitiveness. Solar being cheaper than coal in 130+ countries directly strengthens this economic argument. Option C actually weakens their case about the cost of inaction."
      }
    ]
  },

  // ── S4: Logical Reasoning · Argument Analysis – Language Policy ──────────
  {
    id: 'S4', section: 'Logical Reasoning', topic: 'Argument Analysis – Language Policy',
    difficulty: 'medium', timeLimit: 90, source: 'Original',
    passage: "A state government is proposing to make the teaching of a second regional language compulsory in all government schools from Class 6 onwards. The Education Minister argues this will preserve endangered regional languages, foster cultural unity, and improve cognitive abilities — research shows bilingualism enhances certain executive functions. Teachers' unions oppose the proposal, arguing it will overburden students already managing three core subjects, reduce time for STEM, and that qualified teachers are in short supply. Linguistic scholars have cautiously welcomed the proposal but noted that compulsion rarely produces genuine language acquisition — successful language learning requires motivation and immersive exposure, not just additional class hours.",
    principle: null,
    questions: [
      {
        question: "Which of the following, if true, would most UNDERMINE the Education Minister's claim about cognitive benefits of the policy?",
        options: [
          'Cities that introduced compulsory third languages in schools reported no measurable improvement in students\' performance in other subjects',
          'The regional language proposed has fewer than 200,000 native speakers left in the state',
          'Students in private schools already learn two languages from Class 1',
          'The teachers\' union has opposed language education reforms in the past'
        ],
        correct: 0,
        explanation: "The Minister claims bilingualism enhances cognitive abilities. Evidence from cities that introduced compulsory third languages and saw no cognitive improvement directly undercuts this empirical claim. The other options address different parts of the debate."
      },
      {
        question: "The linguistic scholars' position is best described as:",
        options: [
          'A direct rejection of the compulsory language policy',
          'A qualified endorsement that highlights a potential flaw in the implementation approach',
          'An argument in favour of abolishing compulsory language education',
          'Agreement with the teachers\' union on the teacher shortage problem'
        ],
        correct: 1,
        explanation: "The scholars 'cautiously welcomed' the proposal — that's endorsement. But they flagged that compulsion alone may not achieve genuine acquisition — that's a flaw in approach. This is a qualified endorsement, not a rejection. The key word is 'cautiously.'"
      },
      {
        question: "Which assumption most underlies the Minister's argument that the policy will foster cultural unity?",
        options: [
          'Students who learn a regional language will develop appreciation for and connection to the culture associated with it',
          'Cultural unity can only ever be achieved through a shared common language',
          'Regional languages are endangered primarily because schools have failed to teach them',
          'Teaching a language in school is alone sufficient to fully preserve and revitalise it'
        ],
        correct: 0,
        explanation: "For language learning to produce cultural unity, the Minister must assume that learning the language leads to cultural appreciation and connection. Without this link, learning a language in school does not automatically produce cultural unity."
      },
      {
        question: "A teacher argues: 'If we add a compulsory fourth core subject, students will inevitably score lower in their existing three subjects.' Which position in the passage does this most closely mirror?",
        options: [
          "The Education Minister's argument about cognitive benefits",
          "The teachers' union's concern about overburdening students",
          "The linguistic scholars' point about motivation and genuine acquisition",
          "The government's goal of preserving endangered languages"
        ],
        correct: 1,
        explanation: "The teacher's argument — adding a subject reduces performance in existing subjects — directly parallels the teachers' union's concern that the proposal will overburden students and crowd out time for current core subjects."
      }
    ]
  },

  // ── S5: Quantitative Techniques · Data Interpretation – Survey Statistics
  {
    id: 'S5', section: 'Quantitative Techniques', topic: 'Data Interpretation – Survey Statistics',
    difficulty: 'medium', timeLimit: 90, source: 'Original',
    passage: "A survey of 500 students at a Delhi university found that 60% studied for more than 4 hours daily. Of those who studied more than 4 hours daily, 75% scored above 70% in their semester exams. Of those who studied 4 hours or less, 40% scored above 70%. The survey also found that 80% of students who scored above 70% reported low stress levels, while only 35% of students who scored 70% or below reported low stress levels.",
    principle: null,
    questions: [
      {
        question: "How many students in the survey studied for more than 4 hours daily?",
        options: ['250', '280', '300', '320'],
        correct: 2,
        explanation: "Step 1: 60% of 500 = 0.60 × 500 = 300 students.\nKey tip: In data interpretation, always identify the base (total) before applying the percentage. Here the base is 500."
      },
      {
        question: "How many of the students who studied more than 4 hours daily scored above 70% in their exams?",
        options: ['200', '215', '225', '240'],
        correct: 2,
        explanation: "Step 1: Students studying >4 hrs = 300 (from Q1).\nStep 2: 75% of 300 = 0.75 × 300 = 225 students.\nNote: The base changes here — we're now working with 300, not 500."
      },
      {
        question: "How many students who studied 4 hours or less scored above 70%?",
        options: ['60', '70', '75', '80'],
        correct: 3,
        explanation: "Step 1: Students studying ≤4 hrs = 500 − 300 = 200 students.\nStep 2: 40% of 200 = 0.40 × 200 = 80 students.\nCommon mistake: forgetting to subtract 300 from 500 first."
      },
      {
        question: "What is the total number of students across the survey who scored above 70% in their exams?",
        options: ['285', '295', '305', '315'],
        correct: 2,
        explanation: "Step 1: From >4 hrs group scoring above 70% = 225.\nStep 2: From ≤4 hrs group scoring above 70% = 80.\nStep 3: Total = 225 + 80 = 305.\nThese are mutually exclusive groups so we simply add them."
      }
    ]
  },

  // ── S6: Current Affairs · Right to Information Act 2005 ─────────────────
  {
    id: 'S6', section: 'Current Affairs', topic: 'Right to Information Act 2005',
    difficulty: 'easy', timeLimit: 60, source: 'Original',
    passage: "The Right to Information Act 2005 (RTI Act) is widely recognised as a landmark piece of legislation in India's democratic landscape. The Act empowers every citizen to request information from any public authority within 30 working days of filing an application, placing the burden on the government to provide information rather than on the citizen to justify the need for it. In its first decade, the Act was used by over 17 million citizens, helping expose corruption in infrastructure projects, land acquisition processes and public distribution systems. However, critics argue that the 2019 amendments to the RTI Act — which changed the tenure and salary of Information Commissioners from equivalence with Election Commissioners (constitutional officials) to being determined by the Central Government — have compromised the independence of the RTI machinery. Proponents of the amendments argue that flexibility in appointments was administratively necessary.",
    principle: null,
    questions: [
      {
        question: "What key philosophical principle does the RTI Act embody according to the passage?",
        options: [
          'Citizens must justify their need for information before an application is processed',
          'The burden of providing information shifts to the government rather than resting on the citizen',
          'Governments may withhold information that could affect national security',
          'Only journalists and social activists have the right to file RTI applications'
        ],
        correct: 1,
        explanation: "The passage states the Act places 'the burden on the government to provide information rather than on the citizen to justify the need for it.' This reversal of the burden is the Act's defining philosophical principle."
      },
      {
        question: "Why do critics argue the 2019 amendments weakened the RTI Act?",
        options: [
          'The amendments reduced the response window from 30 to 20 working days',
          'The amendments increased the cost of filing RTI applications',
          "Linking Information Commissioners' tenure and salary to the Central Government undermines their independence as adjudicators",
          'The amendments restricted RTI access to citizens who had filed income tax returns'
        ],
        correct: 2,
        explanation: "The critics' concern is structural: by making tenure and salary subject to government control, the 2019 amendments removed the independence previously guaranteed by equivalence with constitutional Election Commissioners."
      },
      {
        question: "Which of the following best describes the overall tone and structure of the passage?",
        options: [
          'Entirely critical of the RTI Act as ineffective legislation',
          'Strongly supportive of the 2019 amendments as an administrative improvement',
          "Balanced — it acknowledges the Act's democratic achievements while raising concerns about the recent amendments",
          'Neutral statistical reporting without any editorial observation'
        ],
        correct: 2,
        explanation: "The passage first praises the Act's transformative democratic impact, then presents both the critics' concern and the government's justification for the amendments. Presenting multiple perspectives without taking a strong side = balanced."
      }
    ]
  },

  // ── S7: Current Affairs · National Education Policy 2020 ────────────────
  {
    id: 'S7', section: 'Current Affairs', topic: 'National Education Policy 2020',
    difficulty: 'easy', timeLimit: 60, source: 'Original',
    passage: "The National Education Policy 2020 (NEP 2020) represents the most comprehensive overhaul of India's education system since the 1986 policy. Its most discussed provision is the restructuring of the school system from the existing 10+2 format to a 5+3+3+4 structure, corresponding to foundational (ages 3–8), preparatory (8–11), middle (11–14) and secondary (14–18) stages. The NEP recommends that the medium of instruction up to at least Grade 5 — and preferably Grade 8 — be the home language or regional language. In higher education the policy introduces a flexible exit framework: students may leave after one year with a certificate, two years with a diploma, or three years with a degree. The NEP sets a target of 50% Gross Enrolment Ratio in higher education by 2035, up from approximately 26.3% in 2018. Critics have raised concerns about implementation capacity, the language policy's feasibility in linguistically diverse states, and the potential for increased privatisation of higher education.",
    principle: null,
    questions: [
      {
        question: "What is the new school structure proposed under NEP 2020?",
        options: [
          '12+4 — twelve years of schooling followed by a four-year undergraduate degree',
          '5+3+3+4 — four distinct stages corresponding to different age groups',
          '10+2+3 — ten years of school, two years senior secondary, three years college',
          '6+3+3+2 — an alternative four-stage model with different year distributions'
        ],
        correct: 1,
        explanation: "The passage explicitly states the restructuring is to a '5+3+3+4 structure, corresponding to the foundational, preparatory, middle and secondary stages.' The existing format it replaces is 10+2."
      },
      {
        question: "What does NEP 2020 recommend about the medium of instruction in early schooling?",
        options: [
          'English should be the mandatory medium from Class 1 to ensure global competitiveness',
          'Hindi should be the medium of instruction in all Hindi-speaking states up to Class 8',
          'The home language or regional language should be the medium up to at least Grade 5 and preferably Grade 8',
          'Schools should offer dual-medium instruction with equal time in English and the regional language'
        ],
        correct: 2,
        explanation: "The passage states: 'the medium of instruction up to at least Grade 5 — and preferably Grade 8 — be the home language or regional language.' Home/regional language, not English or Hindi specifically."
      },
      {
        question: "A student enrols in a 3-year undergraduate programme under NEP 2020 but is forced to withdraw after completing exactly two full academic years due to financial difficulty. What credential are they entitled to receive?",
        options: [
          'No credential — the degree requires completion of all three years',
          'A certificate — for having completed at least one year of study',
          'A diploma — for having completed two full years of the programme',
          'A provisional degree — valid pending completion of the remaining year'
        ],
        correct: 2,
        explanation: "The flexible exit framework: 1 year = certificate, 2 years = diploma, 3 years = degree. Two full years completed = diploma. This is a direct application question — read the framework carefully and map it to the fact pattern."
      }
    ]
  },

  // ── S8: Legal Reasoning · Contract Law – Offer and Acceptance ───────────
  {
    id: 'S8', section: 'Legal Reasoning', topic: 'Contract Law – Offer and Acceptance',
    difficulty: 'medium', timeLimit: 90, source: 'Original',
    passage: "In contract law, a valid contract requires offer, acceptance, consideration, and the intention to create legal relations. An offer is a definite proposal made by one party (the offeror) to another (the offeree) with the intention that it shall become binding once accepted. An offer may be revoked by the offeror at any time before acceptance, provided the revocation is communicated to the offeree. Crucially, an acceptance must be unconditional and must correspond exactly to the terms of the offer — any modification converts the acceptance into a counter-offer, which itself requires fresh acceptance. Under the postal rule, where parties contemplate that acceptance may be communicated by post, the contract is formed at the moment the letter of acceptance is posted, not when it is received. A promise to keep an offer open for a fixed period is not binding in the absence of separate consideration.",
    principle: null,
    questions: [
      {
        question: "Reema offers to sell her car to Suresh for ₹3 lakh. Suresh replies: 'I will buy it but only if you include the car stereo system.' Has a contract been formed?",
        options: [
          'Yes — Suresh accepted the sale with only a minor addition',
          'No — Suresh\'s response is a counter-offer and not a valid acceptance',
          'Yes — any practical acceptance creates a binding contract',
          'No — Reema\'s offer had already lapsed before Suresh responded'
        ],
        correct: 1,
        explanation: "A valid acceptance must mirror the offer exactly. Suresh introduced a new condition (the stereo), converting his reply into a counter-offer and rejecting the original. No contract is formed until Reema accepts that counter-offer. This is the mirror image rule."
      },
      {
        question: "Ashok sends a letter to Priya offering to sell his shop. Before the letter reaches Priya he posts a revocation. Priya receives the offer letter first and immediately posts a letter of acceptance. Later that day she receives the revocation. Is there a valid contract?",
        options: [
          'Yes — Priya accepted before she received the revocation and under the postal rule her acceptance was complete on posting',
          'No — the revocation was sent first so the offer was effectively withdrawn',
          'Yes — but only if Priya can prove she did not read the revocation before posting',
          'No — because the postal rule does not apply to property transactions'
        ],
        correct: 0,
        explanation: "Under the postal rule, acceptance is complete the moment the letter is posted. Priya posted her acceptance before receiving the revocation. Revocation only takes effect when received — here it was received after acceptance was already complete. A valid contract exists."
      },
      {
        question: "Vandana tells Krishnan on Monday: 'I will sell you my motorcycle for ₹75,000 — you have one week to decide.' On Friday she calls him to withdraw the offer. Krishnan immediately says he accepts on that call. Is there a contract?",
        options: [
          'Yes — Vandana had agreed to keep the offer open for a week and cannot revoke it early',
          'No — Vandana validly revoked the offer before Krishnan accepted',
          'Yes — Krishnan accepted within the one-week period so the contract stands',
          'No — verbal offers for vehicles cannot form valid contracts'
        ],
        correct: 1,
        explanation: "A promise to hold an offer open is not binding without separate consideration. Vandana could revoke at any time before acceptance. She communicated the revocation on Friday — Krishnan's acceptance came after revocation and is therefore ineffective."
      }
    ]
  },

  // ── S9: Legal Reasoning · Constitutional Law – Article 14 ───────────────
  {
    id: 'S9', section: 'Legal Reasoning', topic: 'Constitutional Law – Article 14',
    difficulty: 'hard', timeLimit: 120, source: 'Original',
    passage: "Article 14 of the Indian Constitution guarantees equality before the law and equal protection of the laws to all persons within India. It does not prohibit all classifications — the State may classify persons for legislative purposes provided the classification is based on an intelligible differentia (a real and substantial distinction) and there is a rational nexus between the classification and the object the law seeks to achieve. This is the two-part reasonable classification test. However in E.P. Royappa v. State of Tamil Nadu (1974) the Supreme Court introduced a separate principle: a law or executive action that is arbitrary in nature — even if it does not involve a classification — violates Article 14. In Maneka Gandhi v. Union of India (1978) the Court further held that any procedure restricting personal liberty must also be non-arbitrary to satisfy Article 14's guarantee.",
    principle: null,
    questions: [
      {
        question: "A State law imposes a higher motor tax on diesel commercial vehicles compared to petrol commercial vehicles. A transporter challenges this as a violation of Article 14. The most likely judicial outcome is:",
        options: [
          'The law is unconstitutional — it discriminates between owners of diesel and petrol vehicles',
          'The law is constitutional — the distinction between fuel types is an intelligible differentia and there is a rational nexus to reducing pollution',
          'The law is unconstitutional — Article 14 prohibits all differential taxation',
          'The law is constitutional only if petrol vehicles were taxed at a higher rate in the past'
        ],
        correct: 1,
        explanation: "Article 14 permits classification that is rational. A distinction between diesel and petrol engines is an intelligible differentia. Reducing air pollution is a legitimate state aim. The rational nexus is clear — diesel engines pollute more. The law would be upheld."
      },
      {
        question: "The State of Rajgarh dismisses all government employees appointed on or after a certain date without holding any inquiry. The dismissed employees challenge this under Article 14. Applying the Royappa principle, the most likely outcome is:",
        options: [
          'The action is valid — the State has absolute discretion over the service conditions of its employees',
          'The action violates Article 14 — dismissal of employees solely based on appointment date without inquiry is arbitrary and bears no rational nexus to a legitimate state objective',
          'The action is valid because the State may retrench employees during a fiscal crisis',
          'The employees cannot challenge this under Article 14 — only discrimination on grounds listed in Article 15 is justiciable'
        ],
        correct: 1,
        explanation: "The Royappa principle holds that arbitrariness itself violates Article 14. Dismissing employees solely based on their appointment date with no inquiry or legitimate objective is arbitrary. Even if classification exists, it must have a rational nexus — none exists here."
      },
      {
        question: "What does 'intelligible differentia' mean in the context of Article 14?",
        options: [
          'The requirement that laws must be written in clear and intelligible language for citizens to understand',
          'A real and substantial distinction that distinguishes persons or things in the classified group from those outside it',
          'The principle that only Parliament — not State legislatures — may create legal distinctions between citizens',
          'A judicial test under which classifications based on geography are always presumed valid'
        ],
        correct: 1,
        explanation: "Intelligible differentia means there must be a real and discernible distinction between the persons or things in the classified group and those outside it. Together with rational nexus to the law's objective, this forms the two-part test for valid classification under Article 14."
      }
    ]
  },

  // ── S10: English Language · Democracy and Populism ──────────────────────
  {
    id: 'S10', section: 'English Language', topic: 'Reading Comprehension – Democracy and Populism',
    difficulty: 'medium', timeLimit: 75, source: 'Original',
    passage: "Populism presents a fundamental challenge to liberal democracy. Where liberal democracy rests on independent institutions — courts, a free press, a professional civil service — that constrain majority power, populism claims to speak directly for 'the people' against a corrupt 'elite'. The problem is not that populist parties win elections — electoral victory is legitimate. The problem arises when elected populist leaders begin dismantling the very institutions that hold them accountable. Hungary and Poland in the 2010s provided two case studies: both governments elected democratically proceeded to erode judicial independence, restrict press freedom, and alter electoral laws in ways that made future free elections harder to achieve. Scholars of democratic erosion call this 'democratic backsliding' — a process by which democracy does not die in a single dramatic coup but fades gradually through a thousand small institutional assaults.",
    principle: null,
    questions: [
      {
        question: "What does the passage identify as the primary threat that populism poses to liberal democracy?",
        options: [
          'Populist parties winning elections through illegitimate means',
          'The systematic weakening of accountability institutions once populist leaders gain power through elections',
          "Populism's rejection of market economics in favour of state control",
          'The replacement of professional civil servants with political loyalists'
        ],
        correct: 1,
        explanation: "The passage is careful to say 'the problem is not that populist parties win elections.' The real danger is what follows victory — the dismantling of courts, press freedom and electoral rules that hold government accountable."
      },
      {
        question: "Which of the following best captures the meaning of 'democratic backsliding' as used in the passage?",
        options: [
          'A democracy that is militarily occupied by an authoritarian foreign power',
          'The reversal of democratic gains through a military coup d\'etat',
          'The gradual erosion of democratic institutions through incremental actions by elected leaders',
          'The failure of democratic elections to produce stable or effective governance'
        ],
        correct: 2,
        explanation: "The passage defines the term explicitly: democracy 'does not die in a single dramatic coup but fades gradually through a thousand small institutional assaults.' Gradual institutional erosion by elected leaders — not coups — is the defining feature."
      },
      {
        question: "The passage cites Hungary and Poland primarily in order to:",
        options: [
          'Argue that Eastern European nations are culturally unsuited to sustaining liberal democracy',
          'Illustrate how democratically elected governments can systematically undermine democratic institutions over time',
          'Demonstrate that populism is exclusively a European political phenomenon',
          'Show that changes to electoral law are the single most dangerous form of democratic backsliding'
        ],
        correct: 1,
        explanation: "Hungary and Poland serve as concrete case studies — real examples of democratically elected governments that then eroded judicial independence, press freedom and electoral fairness — illustrating the abstract pattern of democratic backsliding."
      }
    ]
  },

  // ── S11: English Language · India's Water Crisis ─────────────────────────
  {
    id: 'S11', section: 'English Language', topic: "Reading Comprehension – India's Water Crisis",
    difficulty: 'easy', timeLimit: 60, source: 'Original',
    passage: "India faces a water crisis of staggering proportions. With 18 percent of the world's population but only 4 percent of its freshwater resources, the country's per capita water availability has fallen from around 5,200 cubic metres in 1951 to below 1,600 cubic metres today. The Central Water Commission projects that demand will exceed supply by 2050 if current patterns continue. The crisis has multiple physical causes: the spread of water-intensive crops in semi-arid regions, massive over-extraction of groundwater (India is the world's largest user of groundwater), deteriorating urban infrastructure, and climate-driven shifts in monsoon patterns. Yet the crisis is not simply one of physical scarcity — it is equally a crisis of governance. Water pricing in most Indian states does not reflect scarcity: farmers receive it at near-zero cost encouraging over-use, while urban slum dwellers not connected to municipal networks pay among the highest prices in the world to private water vendors.",
    principle: null,
    questions: [
      {
        question: "What does the passage identify as the fundamental nature of India's water crisis?",
        options: [
          'A crisis caused exclusively by climate change and shifting monsoon patterns',
          'Both a crisis of physical scarcity and a crisis of governance and pricing policy',
          "Primarily a crisis of urban infrastructure that has failed to keep pace with population growth",
          "A crisis created entirely by the agricultural sector's choice of water-intensive crops"
        ],
        correct: 1,
        explanation: "The passage explicitly states: 'the crisis is not simply one of physical scarcity — it is equally a crisis of governance.' Both dimensions are central to the author's diagnosis. The word 'equally' signals they are both of the same importance."
      },
      {
        question: "According to the passage, how does water pricing in India worsen the crisis?",
        options: [
          'Water is priced too high for urban consumers, reducing overall demand and slowing infrastructure investment',
          'Farmers pay near-zero prices encouraging over-use, while urban slum dwellers pay very high prices to private vendors — neither reflects actual scarcity',
          'State governments earn excessive revenue from water pricing which is then diverted away from conservation',
          'Private vendors have lobbied governments to keep municipal water prices artificially low'
        ],
        correct: 1,
        explanation: "The passage contrasts two pricing failures: near-zero cost for farmers (encouraging over-use) and very high costs for slum dwellers buying from vendors. Both reflect a pricing system that does not align with scarcity or equity."
      },
      {
        question: "Which of the following, if true, would most WEAKEN the passage's argument that governance failure is a primary driver of the crisis?",
        options: [
          'Groundwater levels in several Indian states are declining at twice the global average rate',
          "Even with perfect pricing and governance, India's total freshwater resources would be physically insufficient to meet projected 2050 demand",
          'Many Indian states have recently introduced legislation linking water tariffs to seasonal scarcity',
          'Private water vendors in Indian cities are regulated by municipal authorities in most states'
        ],
        correct: 1,
        explanation: "The passage says the crisis is 'not simply one of physical scarcity' — implying governance can solve much of it. If demand would exceed physical supply even with perfect governance, this undermines the governance-first framing and makes physical scarcity the irreducible core problem."
      }
    ]
  },

  // ── S12: Logical Reasoning · Universal Basic Income ─────────────────────
  {
    id: 'S12', section: 'Logical Reasoning', topic: 'Argument Analysis – Universal Basic Income',
    difficulty: 'medium', timeLimit: 90, source: 'Original',
    passage: "A growing number of economists and policy advocates in India are calling for a Universal Basic Income (UBI) — a regular unconditional cash transfer to every citizen regardless of employment or income status. Proponents argue that UBI would eliminate the wastage and leakage inherent in India's current welfare architecture which involves hundreds of overlapping schemes with high administrative costs and chronic underpayment. They also argue that UBI would provide a safety net against automation-driven job losses. Critics contend that a truly universal and adequate UBI would be fiscally impossible for a developing country like India and that unconditional transfers might reduce recipients' incentive to work. A 2017 Economic Survey chapter estimated that a basic income of ₹7,620 per person per year could be financed by replacing existing centrally sponsored schemes — but this amount would leave recipients well below the poverty line.",
    principle: null,
    questions: [
      {
        question: "What is the central argument made by UBI proponents in the passage?",
        options: [
          'That UBI is less expensive per beneficiary than existing targeted welfare schemes',
          'That UBI would streamline welfare delivery and provide a safety net against automation-driven unemployment',
          'That automation will eliminate the majority of Indian jobs within the next decade',
          "That India's current welfare schemes are entirely fraudulent and must be abolished immediately"
        ],
        correct: 1,
        explanation: "Proponents make two linked arguments: (1) eliminating wastage in the current fragmented welfare system and (2) protecting against automation-driven job losses. Together these form the core affirmative case for UBI in the passage."
      },
      {
        question: "Which of the following, if true, would most strongly undermine the critics' claim that UBI reduces the incentive to work?",
        options: [
          'Several countries that piloted UBI programmes reported moderate inflation during the trial period',
          'A two-year UBI pilot in Finland found no measurable reduction in employment or job-seeking behaviour among recipients',
          "India's agricultural workforce is unlikely to face significant automation in the next 20 years",
          'The Economic Survey estimated that a UBI of ₹7,620 would cost more than replacing existing welfare schemes'
        ],
        correct: 1,
        explanation: "The critics argue unconditional transfers reduce work incentives. Real-world evidence from Finland showing recipients did not reduce employment directly refutes the empirical assumption underlying this criticism — making it the strongest counter-evidence."
      },
      {
        question: "What is the most significant practical limitation of the Economic Survey's UBI estimate as described in the passage?",
        options: [
          'The administrative cost of disbursing cash to every Indian citizen would itself exceed current welfare spending',
          'Even at ₹7,620 per year the income falls below the poverty line — the fiscally feasible version fails at its own stated purpose',
          'The estimate was calculated without adjusting for inflation since 2017',
          'Replacing existing schemes would deprive beneficiaries who receive more than ₹7,620 under current programmes'
        ],
        correct: 1,
        explanation: "The passage notes that even the Survey's affordable figure 'would leave recipients well below the poverty line.' The version of UBI that can be funded is inadequate; the adequate version cannot be funded. This is the core practical trap identified in the passage."
      }
    ]
  },

  // ── S13: Logical Reasoning · Social Media Age Restriction ───────────────
  {
    id: 'S13', section: 'Logical Reasoning', topic: 'Argument Analysis – Social Media Age Restriction',
    difficulty: 'medium', timeLimit: 90, source: 'Original',
    passage: "Australia passed legislation in 2024 banning children under 16 from using social media platforms. Supporters argued that social media platforms are designed to maximise engagement through addictive features, that their algorithms amplify harmful content, and that young people lack the emotional maturity to navigate these environments safely. They cited research linking heavy adolescent social media use to rising rates of anxiety and depression. Opponents argued that the ban is unenforceable, would drive teenagers to use platforms in less monitored ways, and deprives young people of genuine benefits including peer communities, creative expression and civic participation. Some mental health researchers also cautioned that studies linking social media to depression are largely correlational rather than causal — and that correlation does not establish that social media causes depression.",
    principle: null,
    questions: [
      {
        question: "Which of the following, if true, would most strongly support the opponents' concern about enforceability?",
        options: [
          "A majority of Australian parents support the ban and have agreed to monitor their children's devices",
          "When South Korea introduced a mandatory gaming curfew for minors, 95 percent of teenagers found ways to bypass it within weeks",
          'Social media companies have agreed to implement age-verification technology on their platforms',
          'Research on adolescent mental health outcomes worsened in the two years before Australia introduced the ban'
        ],
        correct: 1,
        explanation: "The opponents argue the ban is unenforceable. Direct evidence from an analogous intervention (South Korea's gaming curfew) being overwhelmingly circumvented provides the strongest empirical support for this concern. Option A actually weakens the enforceability concern."
      },
      {
        question: "The mental health researchers' objection that studies are 'correlational rather than causal' means:",
        options: [
          'The sample sizes in most studies are too small to draw statistically valid conclusions',
          'Social media use and depression are observed together but this does not prove that one causes the other — perhaps depressed teenagers use social media more',
          'The researchers believe social media has no negative effect on the mental health of young people',
          'Correlation studies are considered methodologically unreliable in academic mental health research'
        ],
        correct: 1,
        explanation: "Correlation means two variables move together. Causation means one produces the other. It is possible that teenagers who are already anxious or depressed turn to social media — in which case social media does not cause the depression. This is the methodological objection the researchers are raising."
      },
      {
        question: "Which of the following best describes the logical structure of the supporters' argument for the ban?",
        options: [
          'Social media is harmful to all users therefore it should be banned for everyone',
          "Young people are a specific vulnerable group whose developmental vulnerability justifies age-based restrictions on access to platforms designed to exploit it",
          'Australia has the sovereign legal authority to regulate digital platforms therefore the ban is justified',
          'Since addiction is caused by platform design the correct remedy is to regulate design not restrict access by age'
        ],
        correct: 1,
        explanation: "The supporters do not argue social media is harmful to all — they make a targeted argument: young people specifically lack emotional maturity and are more vulnerable to addictive design and harmful content. The argument is: vulnerability + platform design = proportionate age-based restriction."
      }
    ]
  },

  // ── S14: Quantitative Techniques · Education Survey ──────────────────────
  {
    id: 'S14', section: 'Quantitative Techniques', topic: 'Data Interpretation – Education Survey',
    difficulty: 'medium', timeLimit: 90, source: 'Original',
    passage: "A national education survey collected data from 1,200 students equally distributed across four states — 300 from each state. The Class X board exam pass rates were: State A 60%, State B 75%, State C 45%, and State D 80%. Additionally, the proportion of students attending private schools in each state was: State A 40%, State B 55%, State C 30%, and State D 70%. Nationally, students in private schools had a pass rate of 85% and students in government schools had a pass rate of 50%.",
    principle: null,
    questions: [
      {
        question: "What is the total number of students across all four states who passed the Class X board exam?",
        options: ['720', '750', '780', '810'],
        correct: 2,
        explanation: "State A: 300 × 60% = 180. State B: 300 × 75% = 225. State C: 300 × 45% = 135. State D: 300 × 80% = 240.\nTotal = 180 + 225 + 135 + 240 = 780.\nTip: Each state has 300 students — calculate separately then add."
      },
      {
        question: "How many of the 1,200 students surveyed attended private schools in total?",
        options: ['555', '585', '610', '625'],
        correct: 1,
        explanation: "State A: 300 × 40% = 120. State B: 300 × 55% = 165. State C: 300 × 30% = 90. State D: 300 × 70% = 210.\nTotal private school students = 120 + 165 + 90 + 210 = 585."
      },
      {
        question: "If State D's pass rate of 80% were set as the target for all states, how many additional students across States A, B and C combined would need to pass to meet that target?",
        options: ['150', '165', '180', '200'],
        correct: 2,
        explanation: "Each state needs 300 × 80% = 240 to pass.\nState A currently has 180 — needs 60 more.\nState B has 225 — needs 15 more.\nState C has 135 — needs 105 more.\nTotal additional students needed = 60 + 15 + 105 = 180."
      }
    ]
  },

  // ── S15: Quantitative Techniques · Partnership and Simple Interest ───────
  {
    id: 'S15', section: 'Quantitative Techniques', topic: 'Partnership and Simple Interest',
    difficulty: 'medium', timeLimit: 90, source: 'Original',
    passage: "Priya and Aryan invest money together in a trading business. Priya invests ₹40,000 for the entire 12 months of the year. Aryan invests ₹80,000 but withdraws his investment after 9 months. At the end of the year the business earns a total profit of ₹25,000 which they agree to divide in proportion to their respective capital-time contributions (capital multiplied by number of months invested). Separately, Priya has also lent ₹20,000 to a friend at a simple interest rate of 6% per annum for a period of 2.5 years.",
    principle: null,
    questions: [
      {
        question: "In what ratio should Priya and Aryan divide the business profit?",
        options: ['1 : 2', '2 : 3', '3 : 4', '4 : 5'],
        correct: 1,
        explanation: "Priya's capital-time = ₹40,000 × 12 = 4,80,000.\nAryan's capital-time = ₹80,000 × 9 = 7,20,000.\nRatio = 4,80,000 : 7,20,000 = 2 : 3.\nTip: Always multiply capital by time period before comparing — Aryan invested more but for fewer months."
      },
      {
        question: "What is Priya's share of the business profit?",
        options: ['₹8,000', '₹10,000', '₹12,000', '₹15,000'],
        correct: 1,
        explanation: "Ratio is 2 : 3, so total parts = 5.\nPriya's share = 2/5 × ₹25,000 = ₹10,000.\nAryan's share = 3/5 × ₹25,000 = ₹15,000 (verify: 10,000 + 15,000 = 25,000 ✓)."
      },
      {
        question: "What is Priya's total income combining her business profit share and the simple interest earned on her loan?",
        options: ['₹11,500', '₹12,500', '₹13,000', '₹13,500'],
        correct: 2,
        explanation: "Simple Interest = (P × R × T) / 100 = (20,000 × 6 × 2.5) / 100 = ₹3,000.\nPriya's profit share = ₹10,000 (from Q2).\nTotal income = ₹10,000 + ₹3,000 = ₹13,000.\nFormula to memorise: SI = PRT/100."
      }
    ]
  },

  // ── S16: Current Affairs · Digital Personal Data Protection Act 2023 ─────
  {
    id: 'S16', section: 'Current Affairs', topic: 'Digital Personal Data Protection Act 2023',
    difficulty: 'easy', timeLimit: 60, source: 'Original',
    passage: "The Digital Personal Data Protection Act 2023 (DPDPA) is India's first comprehensive legislation governing the collection, storage and processing of personal data by organisations and government entities. Passed by Parliament in August 2023, the Act introduces the concept of a 'Data Principal' — the individual whose data is being processed — and a 'Data Fiduciary' — the entity collecting or processing that data. Key provisions include: Data Fiduciaries must obtain clear and specific consent before processing personal data; individuals have the right to access, correct and erase their data; processing the data of children (defined as persons under 18) requires verifiable parental consent; and a Data Protection Board of India has been established to adjudicate complaints and impose penalties of up to ₹250 crore for breaches. The Act applies not only to data processing within India but also to processing outside India where it involves offering goods or services to persons within India.",
    principle: null,
    questions: [
      {
        question: "Under the DPDPA 2023, who is a 'Data Principal'?",
        options: [
          'The government body responsible for regulating data companies in India',
          'The company or organisation that collects and processes an individual\'s personal data',
          'The individual whose personal data is being collected or processed',
          'The chairperson of the Data Protection Board of India'
        ],
        correct: 2,
        explanation: "The Act defines 'Data Principal' as the individual whose personal data is being processed — i.e., the person whose rights the Act is designed to protect. The entity collecting the data is the 'Data Fiduciary' — the opposite term."
      },
      {
        question: "A company launches a children's educational app in India. What special obligation does the DPDPA 2023 impose before the app can collect the data of its users?",
        options: [
          'The app must be licensed by the Ministry of Electronics and Information Technology',
          'The app must obtain verifiable parental consent before processing the personal data of any user below 18',
          'The app may only collect anonymised data from child users with no exceptions',
          'The app must store all children\'s data exclusively on government-approved servers in India'
        ],
        correct: 1,
        explanation: "The DPDPA specifically requires verifiable parental consent before a Data Fiduciary can process the personal data of a child (under 18). This is a targeted protection recognising the vulnerability of minor users."
      },
      {
        question: "A company's servers are breached, exposing the personal data of 10 lakh Indian users. What is the maximum penalty the Data Protection Board can impose under the DPDPA 2023?",
        options: ['₹50 crore', '₹100 crore', '₹200 crore', '₹250 crore'],
        correct: 3,
        explanation: "The DPDPA empowers the Data Protection Board to impose penalties of up to ₹250 crore for significant personal data breaches. This is among the highest data protection penalties prescribed in Indian law. Remember: 250 crore is the maximum."
      }
    ]
  },

  // ── S17: Current Affairs · Chandrayaan-3 ─────────────────────────────────
  {
    id: 'S17', section: 'Current Affairs', topic: 'Chandrayaan-3 and Space Exploration',
    difficulty: 'easy', timeLimit: 60, source: 'Original',
    passage: "On 23 August 2023, India's Chandrayaan-3 mission made history when the Vikram lander successfully touched down near the Moon's south pole. India thereby became the first country in the world to land a spacecraft near the lunar south pole and only the fourth country — after the United States, the Soviet Union and China — to achieve a successful soft landing on the Moon. The mission was executed by the Indian Space Research Organisation (ISRO). The rover Pragyan, deployed from Vikram, conducted surface experiments for approximately 14 days (one lunar day) before entering sleep mode. Scientists targeted the south pole because permanently shadowed craters there are believed to contain deposits of water ice — a resource that would be vital for sustaining future long-duration lunar missions and potentially for producing rocket propellant. Chandrayaan-3 succeeded where Chandrayaan-2 had failed in 2019 when the Vikram lander of that mission lost communication during its final descent phase.",
    principle: null,
    questions: [
      {
        question: "What made Chandrayaan-3's landing historically significant?",
        options: [
          'India sent the first rover to operate on the Moon, preceding similar missions from the USA and China',
          'India became the first country to land near the Moon\'s south pole and the fourth country overall to achieve a soft lunar landing',
          'Chandrayaan-3 was the first mission to return lunar surface samples to Earth',
          'ISRO became the first space agency to complete a lunar mission without international collaboration'
        ],
        correct: 1,
        explanation: "The passage states two distinct historic achievements: first country to land near the lunar south pole AND fourth country overall to achieve a soft landing on the Moon. Both distinctions define the mission's historic significance."
      },
      {
        question: "Why did scientists specifically target the Moon's south pole for the Chandrayaan-3 landing?",
        options: [
          'The south pole receives continuous sunlight making solar power generation reliable for the rover',
          "The south pole is the closest point on the Moon's surface to Earth",
          "Permanently shadowed craters at the south pole are believed to contain deposits of water ice crucial for future missions",
          "The terrain at the south pole is the flattest on the Moon making landing safer"
        ],
        correct: 2,
        explanation: "The passage states scientists targeted the south pole because 'permanently shadowed craters there are believed to contain deposits of water ice — a resource vital for sustaining future long-duration lunar missions and potentially for producing rocket propellant.'"
      },
      {
        question: "What happened during the Chandrayaan-2 mission in 2019?",
        options: [
          'The rover Pragyan was deployed successfully but failed to transmit any scientific data',
          'The mission was abandoned before launch due to a technical fault in the rocket',
          'The Vikram lander lost communication with ground control during its final descent phase and could not land safely',
          'The mission landed successfully but found no evidence of water ice at the target site'
        ],
        correct: 2,
        explanation: "The passage explicitly states that Chandrayaan-3 'succeeded where Chandrayaan-2 had failed in 2019 when the Vikram lander of that mission lost communication during its final descent phase.' The partial failure directly informed the redesigned Chandrayaan-3 approach."
      }
    ]
  }

];

export default questionBank;

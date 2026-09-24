export interface TimelineMoment {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  description: string;
  iconType: 'arrival' | 'haldi' | 'mehndi' | 'sangeet' | 'barat' | 'ceremony' | 'dinner' | 'midnight';
}

export interface JourneyEvent {
  number: string; // '01', '02', etc.
  date: string; // '20 Nov, 6:00 PM'
  isoStart: string; // '2027-11-20T18:00:00'
  isoEnd: string;
  title: string;
  venue: string;
  description: string;
  attire: string;
  imageUrl?: string;
  svgType: 'haldi' | 'mehndi' | 'sangeet' | 'barat' | 'ceremony' | 'sundowner' | 'dinner' | 'brunch';
}

export interface FamilySide {
  side: string; // "Bride's Parents"
  names: string;
  blessing: string;
  photoUrl: string;
}

export interface Wish {
  id: string;
  author: string;
  message: string;
  tag: string;
  timestamp: string;
  likes: number;
}

export interface RSVPRecord {
  id: string;
  attendance: 'accept' | 'decline';
  fullName: string;
  email: string;
  phone?: string;
  guestCount: number;
  events: string[];
  dietary?: string;
  note?: string;
  submittedAt: string;
}

export interface HotelRecommendation {
  name: string;
  category: string;
  distance: string;
  note: string;
  bookingUrl?: string;
}

export interface CoordinatorContact {
  role: string;
  name: string;
  phone: string;
  email: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface WeddingConfig {
  couple: {
    brideName: string;
    groomName: string;
    weddingDateString: string;
    venueName: string;
    venueCity: string;
    venueCountry: string;
    numericDateMark: string;
    targetTimestamp: string; // ISO date for countdown
  };
  ourStory: {
    eyebrow: string;
    heading: string;
    subheading: string;
    photoUrl: string;
    storyParagraphs: string[];
    photoCaption: string;
  };
  orderOfDay: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    moments: TimelineMoment[];
  };
  journey: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    events: JourneyEvent[];
  };
  families: {
    eyebrow: string;
    heading: string;
    blessingQuote: string;
    brideParents: FamilySide;
    groomParents: FamilySide;
  };
  wishingWall: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    initialWishes: Wish[];
  };
  rsvp: {
    eyebrow: string;
    heading: string;
    deadlineText: string;
    eventOptions: { id: string; label: string; date: string }[];
  };
  travel: {
    eyebrow: string;
    heading: string;
    airport: {
      name: string;
      code: string;
      distance: string;
      details: string;
    };
    roomBlock: {
      hotelName: string;
      promoCode: string;
      discountText: string;
      bookingInstructions: string;
    };
    shuttleInfo: string;
    hotels: HotelRecommendation[];
    venueMap: {
      coordinates: string;
      lat: number;
      lng: number;
      address: string;
      googleMapsUrl: string;
      photoUrl: string;
    };
  };
  contact: {
    eyebrow: string;
    heading: string;
    subtext: string;
    whatsappNumber: string;
    whatsappMessage: string;
    coordinators: CoordinatorContact[];
    faqs: FAQItem[];
  };
}

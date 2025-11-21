import { Testimonials } from "@/components/ui/testimonials"

const testimonials = [
  {
    text: "This is awesome, Nikhil!🔥 The idea behind H.E.L.I.X. is next-level — proud of you, man. All the best for the final round! 🙌",
    name: 'Vaibhav Pant',
    username: '@vaibhavpant',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: "This is crazy! striking the bolt that holds the machine of capitalism together! 🔩 Kudos to the team, more power to you!",
    name: 'Aditya Lakhani',
    username: '@adityalakhani',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: "🌟 Congratulations Nikhil and team! This is an incredible initiative — using AI and blockchain for transparency and fraud prevention in public procurement is truly impactful. 👏 Keep innovating and driving positive change! 💪",
    name: 'Arvind Khoda',
    username: '@arvindkhoda',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: 'H.E.L.I.X. transformed our municipal procurement process. The transparency features helped us save ₹2.3 crores in just 6 months!',
    name: 'Priya Sharma',
    username: '@priyasharma',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: 'As a government official, I can finally track every rupee. The blockchain audit trail gives me confidence in our processes.',
    name: 'Rajesh Kumar',
    username: '@rajeshkumar',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: 'The AI fraud detection caught 3 suspicious transactions in our district. This system is a game-changer for governance!',
    name: 'Anita Patel',
    username: '@anitapatel',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: 'H.E.L.I.X. made our procurement pipeline transparent overnight. We finally see where funds go and why.',
    name: 'Suresh Reddy',
    username: '@sureshreddy',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: 'The citizen portal is brilliant! Now we can verify if our tax money is being used properly. Great work team!',
    name: 'Meera Singh',
    username: '@meerasingh',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: 'As a vendor, the transparent bidding process gives me confidence. No more backdoor deals!',
    name: 'Vikram Gupta',
    username: '@vikramgupta',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: "You hear about corruption and stolen public funds all the time and feel helpless. H.E.L.I.X. is the first thing I've seen that gives me real hope. Knowing that there's a technology that can make sure money for schools or hospitals actually gets where it's supposed to go is incredible. Thank you for building this.",
    name: 'Vinay Goswami',
    username: '@vinaygoswami',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: "Absolutely love this concept! 💡 Using AI and blockchain to make government spending transparent and fraud-proof is a real game changer. 🚀",
    name: 'Gaurav Pathak',
    username: '@gauravpathak',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: "I've seen countless so-called anti-corruption tools come and go, but H.E.L.I.X. felt different. It's not another promise; it's a shift in how trust works. For the first time, it feels like technology is actually making honesty unstoppable.",
    name: 'Stoyan Radev',
    username: '@stoyanradev',
    social: 'https://i.imgur.com/VRtqhGC.png'
  }
];

export function TestimonialsDemo() {
  return (
    <div className="w-screen py-20 mb-10">
      <Testimonials testimonials={testimonials} />
    </div>
  )
}
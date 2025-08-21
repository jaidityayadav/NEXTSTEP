import { useState } from "react";
import { FooterSection } from "../Components/FooterSection";
import { Navbarnew } from "../Components/Navbarnew";
import Githublogo from "../assets/Github.png";
import backendUrl from "../api";
import { toast } from "react-hot-toast"
import axios from "axios";
export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`${backendUrl}/feedback`, {
        name,
        email,
        message,
      }, {
        headers: { "Content-Type": "application/json" }
      });
    
      toast.success("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
    
  }
  return (
    <div
      className="flex flex-col md:min-h-screen justify-between overflow-auto"
      style={{
        backgroundImage: "url('/img/hero-2.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        paddingTop: 0,
        marginTop: 0,
      }}
    >
      <div>
        <Navbarnew />
      </div>
      {/* Main Content - Takes Up Remaining Space */}
      <div className=" bg-white md:bg-stone-800 pt-4 pb-6 bg-gradient-to-r from-[#020024] via-[#386060] to-[#386060]">
        <div className="flex-grow rounded-xl grid md:mt-4 grid-cols-1 items-start p-8 mx-auto max-w-2xl bg-zinc-100 shadow-lg">
          <h1 className="px-4 font-mono underline text-gray-800 text-3xl font-bold text-center">Let's Talk</h1>
          <p className="font-mono text-md text-black font-semibold mt-4">
            We’d love to hear from you! Whether you have questions, feedback, or need assistance, feel free to reach out.
          </p>

          <form onSubmit={handleSubmit} className="mt-6">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="w-full p-2 border rounded mb-4" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" className="w-full p-2 border rounded mb-4" required />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your Message" className="w-full p-2 border rounded mb-4" required></textarea>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>
      </div>

      {/* Footer - Always Visible */}<div>
        <FooterSection />
      </div>
    </div>
  );

}

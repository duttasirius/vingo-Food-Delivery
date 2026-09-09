import { useEffect, useRef, useState } from "react";
import { Bot, Check, LoaderCircle, MessageCircle, Send, Sparkles, ShoppingBag, X } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";
import { serverurl } from "../App";

const starterMessage = {
  role: "assistant",
  answer: "Hi! I’m your Vingo food assistant. Tell me what you’re craving and I’ll find the best matches from the available restaurants.",
};

const AiFoodAssistant = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([starterMessage]);
  const [addedItemId, setAddedItemId] = useState(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const search = async (event) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2 || loading) return;

    setQuery("");
    setMessages((current) => [...current, { role: "user", text: trimmedQuery }]);
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${serverurl}/api/item/ai-search`,
        { query: trimmedQuery },
        { withCredentials: true },
      );

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          answer: data.success ? data.answer : data.message || "I couldn’t search right now. Please try again.",
          items: data.success ? data.items || [] : [],
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          answer: error?.response?.data?.message || "I couldn’t search right now. Please try again.",
          items: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addItem = (item) => {
    const existing = cartItems?.find((cartItem) => String(cartItem.id) === String(item._id));
    dispatch(
      addToCart({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        shop: item.shop,
        quantity: 1,
        foodType: item.foodType,
      }),
    );
    setAddedItemId(item._id);
    setTimeout(() => setAddedItemId(null), 1400);
    return existing;
  };

  return (
    <div className="fixed bottom-5 right-5 z-[70]">
      {open && (
        <section className="mb-4 flex w-[calc(100vw-2rem)] max-w-[410px] flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-[0_24px_70px_-18px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <header className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 px-5 py-4 text-white">
            <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-inner backdrop-blur-md"><Sparkles size={20} /></div>
                <div>
                  <div className="flex items-center gap-2"><p className="font-semibold tracking-tight">Vingo AI</p><span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">AI</span></div>
                  <p className="mt-0.5 text-xs text-white/75">Your personal food finder</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close AI assistant" className="rounded-full p-2 transition hover:bg-white/15"><X size={19} /></button>
            </div>
          </header>

          <div ref={messagesRef} className="max-h-[58vh] min-h-[300px] space-y-4 overflow-y-auto bg-gradient-to-b from-orange-50/60 to-white p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                {message.role === "user" ? (
                  <div className="max-w-[82%] rounded-2xl rounded-br-md bg-gradient-to-br from-orange-500 to-red-500 px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm">{message.text}</div>
                ) : (
                  <div className="flex max-w-[96%] gap-2.5">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-100"><Bot size={16} /></div>
                    <div className="min-w-0">
                      <div className="rounded-2xl rounded-bl-md border border-slate-100 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-700 shadow-sm">{message.answer}</div>
                      {message.items?.length > 0 && (
                        <div className="mt-2.5 space-y-2">
                          {message.items.map((item) => (
                            <div key={item._id} className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                              <img className="h-14 w-14 shrink-0 rounded-xl bg-slate-50 object-cover" src={item.image} alt={item.name} />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-orange-600">{item.name}</p>
                                <p className="mt-0.5 text-xs font-medium text-orange-600">₹{item.price} · {item.shop?.name || "Restaurant"}</p>
                              </div>
                              <button type="button" onClick={() => addItem(item)} aria-label={`Add ${item.name} to cart`} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-100 px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-700">
                                {addedItemId === item._id ? <><Check size={14} />Added</> : <><ShoppingBag size={14} />Add</>}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="flex justify-start"><div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-100 bg-white px-4 py-3 shadow-sm"><LoaderCircle className="animate-spin text-orange-500" size={15} /><span className="text-xs text-slate-500">Finding the best food matches…</span></div></div>}
          </div>

          <div className="border-t border-slate-100 bg-white p-3">
            <form onSubmit={search} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 shadow-inner focus-within:border-orange-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-50">
              <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} maxLength={300} className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400" placeholder="Ask for food…" aria-label="Ask Vingo AI" />
              <button type="submit" disabled={loading || query.trim().length < 2} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send search">{loading ? <LoaderCircle className="animate-spin" size={18} /> : <Send size={18} />}</button>
            </form>
            <p className="mt-2 text-center text-[10px] text-slate-400">Try “veg pizza”, “spicy chicken”, or “something sweet”</p>
          </div>
        </section>
      )}

      <button type="button" onClick={() => setOpen((current) => !current)} aria-label={open ? "Close Vingo AI" : "Open Vingo AI"} className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 text-white shadow-[0_12px_30px_-8px_rgba(239,68,68,0.65)] transition duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-200">
        <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition group-hover:opacity-100" />
        {open ? <X size={24} /> : <MessageCircle size={25} />}
      </button>
    </div>
  );
};

export default AiFoodAssistant;

export default function MessageBubble({ from, text, buttons, onSend }) {
  return (
    <div className={`bubble ${from}`}>
      <p>{text}</p>

      {buttons?.map(btn => (
        <button key={btn.text} onClick={() => onSend(btn.payload)}>
          {btn.text}
        </button>
      ))}
    </div>
  );
}

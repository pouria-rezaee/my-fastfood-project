import {
  useMessages,
  setMessageRead,
  deleteMessage,
} from "../../../data/messageStore";
import { formatDateTime } from "../../../data/format";
import { confirmDelete, notify } from "../ui";
import "./MessagesSection.css";

function MessagesSection() {
  const messages = useMessages();

  const handleDelete = async (m) => {
    if (await confirmDelete(`پیام «${m.name}» حذف می‌شود`))
      notify(deleteMessage(m.id), "حذف شد");
  };

  if (messages.length === 0) {
    return <p className="adm-empty">هنوز پیامی از فرم تماس دریافت نشده است</p>;
  }

  return (
    <div className="adm-list">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`adm-card adm-msg ${m.read ? "" : "unread"}`}
        >
          <div className="adm-card-head">
            <div>
              <strong>{m.name}</strong>
              <small className="adm-sub">
                {m.email}
                {m.phone ? ` · ${m.phone}` : ""} · {formatDateTime(m.createdAt)}
              </small>
            </div>
            {!m.read && <span className="adm-tag tag-vip">جدید</span>}
          </div>
          <p className="adm-msg-text">{m.message}</p>
          <div className="adm-actions">
            <button
              className="adm-btn"
              onClick={() => setMessageRead(m.id, !m.read)}
            >
              {m.read ? "علامت‌گذاری به‌عنوان نخوانده" : "خوانده شد"}
            </button>
            <a className="adm-btn" href={`mailto:${m.email}`}>
              پاسخ با ایمیل
            </a>
            <button className="adm-btn danger" onClick={() => handleDelete(m)}>
              حذف
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessagesSection;

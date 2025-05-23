import { useState } from "react";

const ShareButtons = ({ eventTitle, eventUrl }) => {
  const [copied, setCopied] = useState(false);
  
  // Encode event details for sharing
  const encodedTitle = encodeURIComponent(eventTitle);
  const encodedUrl = encodeURIComponent(eventUrl || window.location.href);
  
  // Social media share URLs
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  
  // Handle copy to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl || window.location.href);
    setCopied(true);
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div className="share-buttons">
      <h5 className="mb-3">
        <i className="bi bi-share me-2"></i>
        Share This Event
      </h5>
      
      <div className="d-flex gap-2">
        <a 
          href={facebookShareUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline-primary"
          aria-label="Share on Facebook"
        >
          <i className="bi bi-facebook"></i>
        </a>
        
        <a 
          href={twitterShareUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline-info"
          aria-label="Share on Twitter"
        >
          <i className="bi bi-twitter-x"></i>
        </a>
        
        <a 
          href={whatsappShareUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline-success"
          aria-label="Share on WhatsApp"
        >
          <i className="bi bi-whatsapp"></i>
        </a>
        
        <a 
          href={linkedinShareUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline-primary"
          aria-label="Share on LinkedIn"
        >
          <i className="bi bi-linkedin"></i>
        </a>
        
        <button 
          className="btn btn-outline-secondary"
          onClick={handleCopyLink}
          aria-label="Copy link to clipboard"
        >
          {copied ? (
            <>
              <i className="bi bi-check-lg me-1"></i>
              Copied!
            </>
          ) : (
            <>
              <i className="bi bi-clipboard me-1"></i>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;

/* Facebook Hashtag Remover
 * Author: 	Samuel Jackson (slj11@aber.ac.uk)
 * Author: 	David Murdoch (david@davidmurdoch.com)
 * Date: 	2013-04-22
 * Description: A Google Chrome extension to remove annoying Hashtags from Facebook.
 * This script will currently remove hashtags from both news feed, timeline posts, and comments.
 */

(function() {
    // cycle through posts, remove with regex
    function removeHashtags(obj) {
        obj.each(function() {
            var original = this.nodeValue,
                cleaned = original.replace(/#\w+/g, "");
            if ( original !== cleaned ) {
                this.nodeValue = cleaned;
            }
        });	
    }
    function getText(obj){
        return obj.contents().filter(function() {
            return this.nodeType === 3; // Node.TEXT_NODE
        });
    }
    function clean( root ) {
        // remove hashtags from the home stream and timeline posts
        var content = $(root || "#timeline_tab_content, #home_stream").find(".userContent");
        removeHashtags(getText(content));
	
        // remove hashtags in comments
        content = $(root || ".UFIContainer").find(".UFICommentContent *");
        removeHashtags(getText(content));
    }
    clean();
	
    // Bind change event to the DOM
    $("body").bind("DOMNodeInserted", function(evt) {
        clean(evt.target);
    });
}());
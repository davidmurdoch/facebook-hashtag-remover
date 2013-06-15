/* Facebook Hashtag Remover
 * Author: 	Samuel Jackson (slj11@aber.ac.uk)
 * Author: 	David Murdoch (david@davidmurdoch.com)
 * Date: 	2013-04-22
 * Description: A Google Chrome extension to remove annoying Hashtags from Facebook.
 * This script will currently remove hashtags from both news feed, timeline posts, comments, and captions.
 */

(function($) {
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

		// NEW: Removes the new "linked" hashtags.

		// NOTE: facebook doesn't include special characters as part of the hash tag, this litters the comments with "'s"
		// comments use absolute urls, captions use relative (silly facebook).
    	$(root || "body").find('a[href^="https://www.facebook.com/hashtag/"], a[href^="http://www.facebook.com/hashtag/"], a[href^="/hashtag/"]').remove();


    	// OLD:

		// TODO: consider removing the following once its been confirmed that everyone has the new hashtag links.
		// Facebook does not allow duplicate hashtags within a single comment/post/caption. So I may leave this in here.

        // remove hashtags from the home stream and timeline posts
        var content = $(root || "#timeline_tab_content, #home_stream").find(".userContentWrapper *");
        removeHashtags(getText(content));

        // remove hashtags in comments
        content = $(root || ".UFIContainer").find(".UFICommentContent *");
        removeHashtags(getText(content));

        // remove hashtags in photo/video captions
        var photoCaptionSelector = ".fbPhotosPhotoCaption, .fbPhotosPhotoCaption *";
        // we addBack here in case the fbPhotosPhotoCaption element is the root (which it is, at least for instagram).
        content = $(root || ".photoUfiContainer").find(photoCaptionSelector).addBack(photoCaptionSelector);
        removeHashtags(getText(content));
    }
    clean();

    // Bind change event to the DOM
    $("body").bind("DOMNodeInserted", function(evt) {
        clean(evt.target);
    });
}(jQuery));
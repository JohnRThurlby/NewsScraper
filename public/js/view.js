$(document).ready(function(){
    console.log("in view js")
    // Nav Bar Mobile Slider
    $(".button-collapse").sideNav();
  
      // Click Listener for FORM SUBMISSION to ADD a note
    $('.add-notes-button').on('click', function(){
      console.log("in onlick")
      // Get _id of comment to be deleted
      var articleId = $(this).data("id");
  
      // URL root (so it works in eith Local Host for Heroku)
      var baseURL = window.location.origin;
  
      // Get Form Data by Id
      var frmName = "form-add-" + articleId;
      var frm = $('#' + frmName);
  
  
      // AJAX Call to delete Comment
      $.ajax({
        url: baseURL + '/add/notes/' + articleId,
        type: 'POST',
        data: frm.serialize(),
      })
      .done(function() {
        // Refresh the Window after the call is done
        location.reload();
      });
      
      // Prevent Default
      return false;
  
    });
  
  
    // Click Listener for FORM SUBMISSION to DELETE a note
    $('.delete-notes-button').on('click', function(){
  
      // Get _id of comment to be deleted
      var notesId = $(this).data("id");
  
      // URL root (so it works in eith Local Host for Heroku)
      var baseURL = window.location.origin;
  
      // AJAX Call to delete note
      $.ajax({
        url: baseURL + '/remove/notes/' + noteId,
        type: 'POST',
      })
      .done(function() {
        // Refresh the Window after the call is done
        location.reload();
      });
      
      // Prevent Default
      return false;
  
    });

    // Click Listener for FORM SUBMISSION to save an article
    $('.save-article-button').on('click', function(){
      console.log("in onclick")
      // Get _id of comment to be deleted
      var articleId = $(this).data("id");
  
      // URL root (so it works in eith Local Host for Heroku)
      var baseURL = window.location.origin;
  
      // AJAX Call to save article
      $.ajax({
        url: baseURL + '/save/' + articleId,
        type: 'POST',
      })
      .done(function() {
        // Refresh the Window after the call is done
        location.reload();
      });
      
      // Prevent Default
      return false;
  
    });
    
  });
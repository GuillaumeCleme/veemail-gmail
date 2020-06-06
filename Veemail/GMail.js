function loadAddOn(event) {
  var accessToken = event.gmail.accessToken;
  var messageId = event.gmail.messageId;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  var mailMessage = GmailApp.getMessageById(messageId);
  var from = mailMessage.getFrom();
  
  var composeAction = CardService.newAction()
      .setFunctionName('createReplyDraft');
  
  
  var composeButton = CardService.newTextButton()
      .setText('Compose Reply').setOnClickAction(composeAction);

  
  
/*  
  var action = CardService.newAction()
        .setFunctionName("composeDraft")
        .setParameters({
          accessToken: accessToken,
          messageId: messageId
        });
  
  var openDocButton = CardService.newTextButton()
      .setText("open docs")
      .setOpenLink(
          CardService.newOpenLink().setUrl("https://developers.google.com/gmail/add-ons/")); */

  var card = CardService.newCardBuilder()
      .setHeader(CardService.newCardHeader().setTitle("Veemail Addon"))
      .addSection(CardService.newCardSection()
          //.addWidget(CardService.newTextParagraph().setText("The email is from: " + from))
          .addWidget(composeButton))
      .build();

  return [card];
}

/**
   *  Creates a draft email (with an attachment and inline image)
   *  as a reply to an existing message.
   *  @param {Object} e An event object passed by the action.
   *  @return {ComposeActionResponse}
   */
  function createReplyDraft(e) {
    // Activate temporary Gmail scopes, in this case to allow
    // a reply to be drafted.
    var accessToken = e.gmail.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);

    // Creates a draft reply.
    var messageId = e.gmail.messageId;
    var message = GmailApp.getMessageById(messageId);
    var draft = message.createDraftReply('',
        {
            htmlBody: "Kitten! <img src='cid:kitten'/>",
            attachments: [
              UrlFetchApp.fetch('https://images.unsplash.com/photo-1583524505974-6facd53f4597?ixlib=rb-1.2.1&auto=format&fit=crop&w=165&q=80')
                  .getBlob()
            ],
            inlineImages: {
              "kitten": UrlFetchApp.fetch('https://images.unsplash.com/photo-1583524505974-6facd53f4597?ixlib=rb-1.2.1&auto=format&fit=crop&w=165&q=80')
                           .getBlob()
            }
        }
    );

    // Return a built draft response. This causes Gmail to present a
    // compose window to the user, pre-filled with the content specified
    // above.
    return CardService.newComposeActionResponseBuilder()
        .setGmailDraft(draft).build();
  }

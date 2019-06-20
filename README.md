# MER Mobile Reference Guide Mobile App

The MER Mobile Reference system consists of three major software components, defined primarily by their users:
1.	The Contentful online content management website.  This is the Software as a Service (SAAS) system used to store and distribute updated content (data) to the mobile application.  This system exists and is accessible to system administrators online at www.contentful.com.  Contentful is used primarily by the system administrators responsible for:
  i.	Adding new content editors
  ii.	Revoking access to content management editors who have left
  iii.	Adding a new country / language data set

2.	The MER Mobile Reference Guide Content Editor (referred to as the Content Editor app in this guide).  This is a Windows Desktop application used by content editors to simplify the process of adding, editing and updating the application content without requiring them to have to login to the more technical Contentful interface online.  The Content Editor app is used primarily by content editors.

3.	The mobile application – this is the application that users install to their mobile devices from the mobile app store to view the content.  The application downloads the content from Contentful and stores it locally on the user’s device to allow users to use the system without an internet connection.  This is the only interface that end users will be aware of.  The mobile application is used primarily by the end users.

This repo is for component 3, the mobile application, which is a cross platform mobile application developed using React Native.

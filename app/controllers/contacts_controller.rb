require 'csv'

class ContactsController < ApplicationController

  # For display contacts on index
  def index
    @contacts = Contact.all
  end

  # For create new contact
  def create
    @contact = Contact.new
    @contact.first_name=params[:first_name]
    @contact.last_name=params[:last_name]
    @contact.email=params[:email]
    @contact.org=params[:org]
    @contact.events=params[:events]
    @contact.interests=params[:interests]
    @contact.save

    contacts_list
  end

  # For update contact
  def update_contact
    field_name = params[:field_name]
    @updated_contact = Contact.find_by_id(params[:field_id].to_i)
    @updated_contact.update_attributes(field_name => params[:field_val])

    contacts_list
  end

  # For upload contacts by csv
  def contacts_upload
    #checking for csv file or not
    if params[:file].content_type == "text/csv"

      #read contents from csv file
      contacts = []
      CSV.foreach(params[:file].tempfile) { |row|
        contact_data = {}
        contact_data["first_name"] = row[0]
        contact_data["last_name"] = row[1]
        contact_data["email"] = row[2]
        contact_data["org"] = row[3]
        contact_data["events"] = row[4]
        contact_data["interests"] = row[5]
        contacts << contact_data
      }

      #remove first row with column name and make a new array with contacts
      contacts = contacts[1..contacts.length]
      contacts.each do |contact|
        @contact = Contact.new
        @contact.first_name=contact["first_name"]
        @contact.last_name=contact["last_name"]
        @contact.email=contact["email"]
        @contact.org=contact["org"]
        @contact.events=contact["events"]
        @contact.interests=contact["interests"]
        @contact.save
      end

    else
      puts "----->>>>> Error found due to wrong file format <<<<<-----"
    end

    contacts_list
  end

  # For display contact_list
  def contacts_list
    @contacts = Contact.all
    render :json => @contacts.to_json
  end
end
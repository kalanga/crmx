class Contact < ActiveRecord::Base
  attr_accessible :email, :events, :first_name, :interests, :last_name, :org
end

class Contact < ActiveRecord::Base
  attr_accessible :email, :events, :first_name, :interests, :last_name, :org

  def self.to_csv(options = {})
	  CSV.generate(options) do |csv|
	    csv << ["first_name", "last_name", "email", "org", "events", "interests"]
	    all.each do |product|
	      csv << product.attributes.values_at("first_name", "last_name", "email", "org", "events", "interests")
	    end
	  end
	end

end

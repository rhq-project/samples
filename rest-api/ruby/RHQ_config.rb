class RHQ_config

  def initialize(user = 'rhqadmin', password='rhqadmin')
    @server = 'localhost'
    @port='7080'
    @user = user
    @password = password
    @rest_base = '/rest'

    @base_url = "http://#{@user}:#{@password}@#{@server}:#{@port}" + @rest_base + '/'
  end

  def base_url
      @base_url
  end

  def to_s
    @base_url
  end

  attr_reader :user, :password
end
MusicPlus::Application.routes.draw do
  resources :users

  root :to => 'users#login'
end
